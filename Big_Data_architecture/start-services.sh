#!/bin/bash

# Function to wait for a service to be ready
wait_for_service() {
    local service=$1
    local port=$2
    echo "Waiting for $service to be ready..."
    for i in {1..30}; do
        if nc -z localhost $port; then
            echo "$service is ready!"
            return 0
        fi
        sleep 2
    done
    echo "$service failed to start"
    return 1
}

# Start SSH
service ssh start
sleep 2

# Format namenode if needed
if [ ! -d "/hadoop/hadoop-3.3.0/dfs/name/current" ]; then
    echo "Formatting namenode..."
    $HADOOP_HOME/bin/hdfs namenode -format
fi

# Start Hadoop
echo "Starting Hadoop..."
$HADOOP_HOME/sbin/start-dfs.sh
wait_for_service "Hadoop NameNode" 9870
$HADOOP_HOME/sbin/start-yarn.sh
wait_for_service "YARN ResourceManager" 8088

# Start Zookeeper
echo "Starting Zookeeper..."
$KAFKA_HOME/bin/zookeeper-server-start.sh -daemon $KAFKA_HOME/config/zookeeper.properties
wait_for_service "Zookeeper" 2181

# Start Kafka
echo "Starting Kafka..."
$KAFKA_HOME/bin/kafka-server-start.sh -daemon $KAFKA_HOME/config/server.properties
wait_for_service "Kafka" 9092

# Start Schema Registry
echo "Starting Schema Registry..."
$CONFLUENT_HOME/bin/schema-registry-start -daemon $CONFLUENT_HOME/etc/schema-registry/schema-registry.properties
wait_for_service "Schema Registry" 8081

# Start Spark
echo "Starting Spark..."
$SPARK_HOME/sbin/start-master.sh
wait_for_service "Spark Master" 7077
$SPARK_HOME/sbin/start-worker.sh spark://localhost:7077
wait_for_service "Spark Worker" 8081

# Start MongoDB
echo "Starting MongoDB..."
mongod --fork --logpath /var/log/mongodb.log
wait_for_service "MongoDB" 27017

# Start Elasticsearch
echo "Starting Elasticsearch..."
chown -R elasticsearch:elasticsearch /usr/local/elasticsearch
su elasticsearch -c "$ES_HOME/bin/elasticsearch -d"
wait_for_service "Elasticsearch" 9200

# Start Cerebro
echo "Starting Cerebro..."
/usr/local/cerebro/bin/cerebro -Dhttp.port=9100 &
wait_for_service "Cerebro" 9100

# Start Mongo Express
echo "Starting Mongo Express..."
mongo-express &
wait_for_service "Mongo Express" 8081

# Start Jupyter
echo "Starting Jupyter..."
jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root --NotebookApp.token='' --NotebookApp.password='' &

echo "All services started!"

# Keep container running and show logs
tail -f /var/log/mongodb.log /hadoop/hadoop-3.3.0/logs/* $SPARK_HOME/logs/* /usr/local/kafka/logs/* 2>/dev/null
