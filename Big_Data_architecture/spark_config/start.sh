#!/bin/bash

# Format namenode (only needed first time)
$HADOOP_HOME/bin/hdfs namenode -format

# Start SSH service
service ssh start

# Start HDFS
$HADOOP_HOME/sbin/start-dfs.sh

# Wait for HDFS to be up
sleep 10

# Create kafka_output directory in HDFS
$HADOOP_HOME/bin/hdfs dfs -mkdir -p /kafka_output

# Start Kafka and other services
/usr/local/kafka/start_services.sh

# Keep container running
tail -f /dev/null
