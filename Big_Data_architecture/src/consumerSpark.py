from confluent_kafka import Consumer, KafkaError
import json
import os
import logging
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, LongType, TimestampType
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SparkKafkaConsumer:
    def __init__(self, bootstrap_servers, topic, group_id='spark-consumer-group'):
        self.consumer_config = {
            'bootstrap.servers': bootstrap_servers,
            'group.id': group_id,
            'auto.offset.reset': 'earliest',
            'enable.auto.commit': True
        }
        self.topic = topic
        
        # Initialize Spark session with necessary configurations
        self.spark = SparkSession.builder \
            .appName("KafkaFileProcessor") \
            .config("spark.sql.streaming.schemaInference", "true") \
            .getOrCreate()
        
        # Define schema for file metadata
        self.metadata_schema = StructType([
            StructField("file_path", StringType(), True),
            StructField("file_name", StringType(), True),
            StructField("file_size", LongType(), True),
            StructField("file_type", StringType(), True),
            StructField("modified_time", TimestampType(), True),
            StructField("created_time", TimestampType(), True)
        ])
        
    def process_file(self, file_path, file_type):
        """Process file based on its type"""
        try:
            if file_type.lower() in ['.csv', '.json', '.parquet']:
                # For structured data files
                df = None
                if file_type.lower() == '.csv':
                    df = self.spark.read.csv(file_path, header=True, inferSchema=True)
                elif file_type.lower() == '.json':
                    df = self.spark.read.json(file_path)
                elif file_type.lower() == '.parquet':
                    df = self.spark.read.parquet(file_path)
                
                if df is not None:
                    logger.info(f"Schema for {file_path}:")
                    df.printSchema()
                    logger.info(f"Sample data from {file_path}:")
                    df.show(5, truncate=False)
            else:
                # For other file types, just log the metadata
                logger.info(f"File {file_path} of type {file_type} received")
                
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {str(e)}")
        
    def consume_and_process(self):
        """Consume messages from Kafka and process files"""
        consumer = Consumer(self.consumer_config)
        consumer.subscribe([self.topic])
        
        try:
            while True:
                msg = consumer.poll(1.0)
                
                if msg is None:
                    continue
                
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        logger.info('Reached end of partition')
                    else:
                        logger.error(f'Error: {msg.error()}')
                    continue

                try:
                    # Parse the JSON metadata
                    metadata = json.loads(msg.value().decode('utf-8'))
                    file_path = metadata['file_path']
                    file_type = metadata['file_type']
                    
                    # Create DataFrame from metadata
                    metadata_df = self.spark.createDataFrame([metadata], self.metadata_schema)
                    
                    # Save metadata to parquet for analysis
                    output_path = f"spark_metadata/{time.strftime('%Y%m%d')}"
                    metadata_df.write.mode('append').parquet(output_path)
                    
                    # Process the actual file
                    self.process_file(file_path, file_type)
                    
                except Exception as e:
                    logger.error(f"Error processing message: {str(e)}")
        
        except KeyboardInterrupt:
            logger.info("Stopping consumer")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
        finally:
            consumer.close()
            self.spark.stop()

if __name__ == '__main__':
    # Get configuration from environment variables with defaults
    bootstrap_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:29092')
    topic = os.getenv('KAFKA_TOPIC', 'Comments')
    group_id = os.getenv('KAFKA_GROUP_ID', 'spark-consumer-group')

    try:
        consumer = SparkKafkaConsumer(bootstrap_servers, topic, group_id)
        consumer.consume_and_process()
    except Exception as e:
        logger.error(f"Failed to start consumer: {str(e)}")
        exit(1)