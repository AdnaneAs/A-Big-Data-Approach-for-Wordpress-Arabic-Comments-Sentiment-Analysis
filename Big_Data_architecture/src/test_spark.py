from pyspark.sql import SparkSession
import time

# Create Spark session
spark = SparkSession.builder \
    .appName("Test Application") \
    .master("spark://bigdata-node:7077") \
    .getOrCreate()

# Create some sample data
data = [(1, "John"), (2, "Jane"), (3, "Bob")]
df = spark.createDataFrame(data, ["id", "name"])

# Perform some operations
df.show()

# Keep the application running for a while so we can see the UI
time.sleep(300)  # Sleep for 5 minutes

spark.stop()
