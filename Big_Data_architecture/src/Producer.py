from confluent_kafka import Producer
import time
import os
import json
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
KAFKA_TOPIC = 'Comments'

# Configure the Kafka producer with additional settings
producer_config = {
    'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
    'queue.buffering.max.messages': 1000000,
    'queue.buffering.max.ms': 500
}

producer = Producer(producer_config)

def delivery_callback(err, msg):
    if err:
        logger.error(f'Message delivery failed: {err}')
    else:
        logger.info(f"Message delivered to {msg.topic()} [{msg.partition()}] at offset {msg.offset()}")

def create_file_metadata(file_path):
    """Create metadata for the file including size, type, and modification time."""
    stats = os.stat(file_path)
    return {
        'file_path': file_path,
        'file_name': os.path.basename(file_path),
        'file_size': stats.st_size,
        'file_type': os.path.splitext(file_path)[1],
        'modified_time': stats.st_mtime,
        'created_time': stats.st_ctime
    }

def publish_file_to_kafka(file_path):
    """Publish file metadata to Kafka."""
    try:
        # Create file metadata
        metadata = create_file_metadata(file_path)
        
        # Convert metadata to JSON string
        message = json.dumps(metadata)
        
        # Produce message to Kafka
        producer.produce(
            KAFKA_TOPIC,
            key=file_path.encode('utf-8'),
            value=message.encode('utf-8'),
            callback=delivery_callback
        )
        producer.poll(0)  # Trigger delivery reports
        
    except Exception as e:
        logger.error(f"Error publishing {file_path} to Kafka: {e}")

def scan_folder(folder_path, processed_files):
    """Scan folder for new or modified files."""
    try:
        # Walk through directory tree
        for root, _, files in os.walk(folder_path):
            for file_name in files:
                file_path = os.path.join(root, file_name)
                
                # Skip hidden files
                if file_name.startswith('.'):
                    continue
                
                try:
                    current_mtime = os.path.getmtime(file_path)
                    
                    # Check if file is new or modified
                    if file_path not in processed_files or current_mtime > processed_files[file_path]:
                        logger.info(f'{"Modified" if file_path in processed_files else "New"} file detected: {file_path}')
                        publish_file_to_kafka(file_path)
                        processed_files[file_path] = current_mtime
                        
                except OSError as e:
                    logger.error(f"Error accessing file {file_path}: {e}")
                    
    except Exception as e:
        logger.error(f"Error scanning folder {folder_path}: {e}")

def main():
    folder_path = './Data'
    processed_files = {}
    
    # Create Data directory if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        logger.info(f"Created directory: {folder_path}")
    
    logger.info(f"Starting file monitoring in {folder_path}")
    
    try:
        while True:
            scan_folder(folder_path, processed_files)
            producer.flush()  # Ensure any remaining messages are sent
            time.sleep(1)  # Reduced polling interval for better responsiveness
            
    except KeyboardInterrupt:
        logger.info("Shutting down producer...")
        producer.flush()
        logger.info("Producer stopped successfully")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        producer.flush()

if __name__ == '__main__':
    main()
