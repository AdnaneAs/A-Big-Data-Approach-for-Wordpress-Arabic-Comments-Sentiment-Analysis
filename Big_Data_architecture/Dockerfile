FROM ubuntu:22.04

# Prevent interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Set all environment variables in one layer
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 \
    HADOOP_HOME=/hadoop/hadoop-3.3.0 \
    HADOOP_CONF_DIR=/hadoop/hadoop-3.3.0/etc/hadoop \
    SPARK_HOME=/spark/spark-3.5.4-bin-hadoop3 \
    KAFKA_HOME=/usr/local/kafka \
    ES_HOME=/usr/local/elasticsearch \
    CONFLUENT_HOME=/usr/local/confluent \
    PYSPARK_PYTHON=/usr/bin/python3 \
    PYSPARK_DRIVER_PYTHON=/usr/bin/python3 \
    PATH=$PATH:/usr/lib/jvm/java-11-openjdk-amd64/bin:/hadoop/hadoop-3.3.0/bin:/spark/spark-3.5.4-bin-hadoop3/bin:/spark/spark-3.5.4-bin-hadoop3/sbin:/usr/local/kafka/bin:/usr/local/elasticsearch/bin:/usr/local/confluent/bin

# Install base dependencies in one layer
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    nano \
    sudo \
    openssh-server \
    openssh-client \
    openjdk-11-jdk \
    python3 \
    python3-pip \
    netcat \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip3 install --no-cache-dir \
    jupyter \
    pandas \
    numpy \
    matplotlib \
    confluent_kafka \
    kafka-python \
    hdfs \
    pyspark

# Setup SSH
RUN ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa && \
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys && \
    chmod 0600 ~/.ssh/authorized_keys

# Install Hadoop
RUN mkdir -p /hadoop && \
    wget -q https://archive.apache.org/dist/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz && \
    tar -xzf hadoop-3.3.0.tar.gz -C /hadoop && \
    rm hadoop-3.3.0.tar.gz

# Copy Hadoop configs
COPY ./hadoop_config/* /hadoop/hadoop-3.3.0/etc/hadoop/

# Create necessary Hadoop directories
RUN mkdir -p /hadoop/hadoop-3.3.0/dfs/name && \
    mkdir -p /hadoop/hadoop-3.3.0/dfs/data

# Install Spark
RUN mkdir -p /spark && \
    wget -q https://downloads.apache.org/spark/spark-3.5.4/spark-3.5.4-bin-hadoop3.tgz && \
    tar -xzf spark-3.5.4-bin-hadoop3.tgz -C /spark && \
    rm spark-3.5.4-bin-hadoop3.tgz

# Copy Spark configs
COPY ./spark_config/spark-defaults.conf /spark/spark-3.5.4-bin-hadoop3/conf/
COPY ./spark_config/spark-env.sh /spark/spark-3.5.4-bin-hadoop3/conf/

# Install Kafka
RUN wget -q https://downloads.apache.org/kafka/3.9.0/kafka_2.12-3.9.0.tgz && \
    tar -xzf kafka_2.12-3.9.0.tgz && \
    mv kafka_2.12-3.9.0 /usr/local/kafka && \
    rm kafka_2.12-3.9.0.tgz

# Copy Kafka configs
COPY ./kafka_config/* /usr/local/kafka/config/

# Install Elasticsearch
RUN wget -q https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.1-linux-x86_64.tar.gz && \
    tar -xzf elasticsearch-8.11.1-linux-x86_64.tar.gz && \
    mv elasticsearch-8.11.1 /usr/local/elasticsearch && \
    rm elasticsearch-8.11.1-linux-x86_64.tar.gz

# Configure Elasticsearch
RUN echo "network.host: 0.0.0.0" >> $ES_HOME/config/elasticsearch.yml && \
    echo "discovery.type: single-node" >> $ES_HOME/config/elasticsearch.yml && \
    echo "xpack.security.enabled: false" >> $ES_HOME/config/elasticsearch.yml

# Install Cerebro
RUN wget -q https://github.com/lmenezes/cerebro/releases/download/v0.9.4/cerebro-0.9.4.tgz && \
    tar -xzf cerebro-0.9.4.tgz && \
    mv cerebro-0.9.4 /usr/local/cerebro && \
    rm cerebro-0.9.4.tgz

# Install MongoDB
RUN wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    mkdir -p /data/db

# Install Node.js and Mongo Express
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    npm install -g mongo-express

# Install Schema Registry
RUN wget -q https://packages.confluent.io/archive/7.5/confluent-community-7.5.1.tar.gz && \
    tar -xzf confluent-community-7.5.1.tar.gz && \
    mv confluent-7.5.1 /usr/local/confluent && \
    rm confluent-community-7.5.1.tar.gz

# Create elasticsearch user
RUN useradd elasticsearch && \
    chown -R elasticsearch:elasticsearch /usr/local/elasticsearch

# Copy and set up start script
COPY start-services.sh /start-services.sh
RUN chmod +x /start-services.sh

# Expose all necessary ports
EXPOSE 22 9000 8088 9870 9092 2181 8888 9200 9300 27017 7077 8080 8081 4040 8082

CMD ["/start-services.sh"]
