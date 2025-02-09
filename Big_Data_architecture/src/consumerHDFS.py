from confluent_kafka import Consumer, KafkaError
import os
import hdfs
from retrying import retry
import logging
from typing import Optional
import json
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class HDFSKafkaConsumer:
    def __init__(self, bootstrap_servers: str, topic: str, hdfs_host: str = 'bigdata-node',
                 hdfs_port: int = 9870, group_id: str = 'hdfs-consumer-group', hdfs_default_fs: str = 'hdfs://localhost:8020'):
        """
        Initialize the HDFS Kafka Consumer.
        
        Args:
            bootstrap_servers: Kafka bootstrap servers
            topic: Kafka topic to consume from
            hdfs_host: HDFS host address
            hdfs_port: HDFS port number
            group_id: Kafka consumer group ID
            hdfs_default_fs: HDFS default filesystem URL
        """
        self.consumer_config = {
            'bootstrap.servers': bootstrap_servers,
            'group.id': group_id,
            'auto.offset.reset': 'earliest',
            'enable.auto.commit': True,
            'auto.commit.interval.ms': 5000
        }
        self.topic = topic
        self.consumer: Optional[Consumer] = None
        self.hdfs_base_path = '/kafka-files/'

        # Initialize HDFS client
        hdfs_url = f'http://{hdfs_host}:{hdfs_port}'
        try:
            self.hdfs_client = hdfs.InsecureClient(hdfs_url)
            # Set the default filesystem
            os.environ['HADOOP_HOME'] = '/opt/hadoop'
            os.environ['HADOOP_CONF_DIR'] = '/etc/hadoop'
            os.environ['HDFS_NAMENODE'] = hdfs_default_fs
            
            if not self.hdfs_client.status('/kafka-files', strict=False):
                self.hdfs_client.makedirs('/kafka-files')
            logger.info(f"Successfully connected to HDFS at {hdfs_url}")
        except Exception as e:
            logger.error(f"Failed to connect to HDFS: {str(e)}")
            raise

    @retry(stop_max_attempt_number=5, wait_fixed=2000,
           retry_on_exception=lambda e: isinstance(e, (IOError, Exception)))
    def write_to_hdfs(self, hdfs_path: str, content: bytes) -> None:
        """
        Write content to HDFS with retry mechanism.
        
        Args:
            hdfs_path: Target path in HDFS
            content: Content to write (in bytes)
        """
        try:
            with self.hdfs_client.write(hdfs_path, overwrite=True) as writer:
                writer.write(content)
            logger.info(f"Successfully wrote to HDFS path: {hdfs_path}")
        except Exception as e:
            logger.error(f"Failed to write to HDFS path {hdfs_path}: {str(e)}")
            raise

    def _init_consumer(self) -> None:
        """Initialize the Kafka consumer and subscribe to the topic."""
        if self.consumer is None:
            self.consumer = Consumer(self.consumer_config)
            self.consumer.subscribe([self.topic])
            logger.info(f"Subscribed to topic: {self.topic}")

    def consume_and_store(self) -> None:
        """Main method to consume messages from Kafka and store them in HDFS."""
        self._init_consumer()

        try:
            while True:
                msg = self.consumer.poll(1.0)

                if msg is None:
                    continue

                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        logger.info('Reached end of partition')
                    else:
                        logger.error(f"Kafka error: {msg.error()}")
                    continue

                try:
                    # Parse the JSON metadata from Kafka message
                    message_data = json.loads(msg.value().decode('utf-8'))
                    file_path = message_data['file_path']
                    logger.info(f"Received file metadata from Kafka: {message_data}")

                    if not os.path.exists(file_path):
                        logger.error(f"File does not exist locally: {file_path}")
                        continue

                    # Read file in binary mode to handle both text and binary files
                    with open(file_path, 'rb') as file:
                        content = file.read()

                    # Create HDFS directory structure based on file type
                    file_type = message_data['file_type'].lstrip('.')
                    if not file_type:
                        file_type = 'unknown'
                    
                    hdfs_type_path = os.path.join(self.hdfs_base_path, file_type)
                    if not self.hdfs_client.status(hdfs_type_path, strict=False):
                        self.hdfs_client.makedirs(hdfs_type_path)

                    filename = message_data['file_name']
                    hdfs_file_path = os.path.join(hdfs_type_path, filename)

                    logger.info(f"Writing file to HDFS: {hdfs_file_path}")
                    self.write_to_hdfs(hdfs_file_path, content)
                    
                    # Save metadata
                    metadata_path = f"{hdfs_file_path}.metadata"
                    self.write_to_hdfs(metadata_path, json.dumps(message_data).encode('utf-8'))

                    logger.info(f"Successfully processed {filename}")

                except Exception as e:
                    logger.error(f"Error processing file {file_path}: {str(e)}")

        except KeyboardInterrupt:
            logger.info("Received shutdown signal")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
        finally:
            self._cleanup()

    def _cleanup(self) -> None:
        """Clean up resources."""
        if self.consumer:
            try:
                self.consumer.close()
                logger.info("Kafka consumer closed successfully")
            except Exception as e:
                logger.error(f"Error closing Kafka consumer: {str(e)}")

if __name__ == '__main__':
    # Load environment variables
    load_dotenv()
    
    # Get configuration from environment variables with defaults
    bootstrap_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:29092')
    topic = os.getenv('KAFKA_TOPIC', 'Comments')
    hdfs_host = os.getenv('HDFS_HOST', 'bigdata-node')
    hdfs_port = int(os.getenv('HDFS_PORT', '9870'))
    group_id = os.getenv('KAFKA_GROUP_ID', 'hdfs-consumer-group')
    hdfs_default_fs = os.getenv('HDFS_DEFAULT_FS', 'hdfs://localhost:8020')

    try:
        consumer = HDFSKafkaConsumer(
            bootstrap_servers=bootstrap_servers,
            topic=topic,
            hdfs_host=hdfs_host,
            hdfs_port=hdfs_port,
            group_id=group_id,
            hdfs_default_fs=hdfs_default_fs
        )
        consumer.consume_and_store()
    except Exception as e:
        logger.error(f"Failed to start consumer: {str(e)}")
        exit(1)
