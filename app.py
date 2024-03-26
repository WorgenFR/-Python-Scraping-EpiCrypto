from flask import Flask, render_template
from flask_socketio import SocketIO
from confluent_kafka import Consumer, KafkaError
import json
import threading

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

def kafka_consumer():
    conf = {
        'bootstrap.servers': 'localhost:9092',  # Remplacez par l'adresse de votre serveur Kafka
        'group.id': 'scrappeur',
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    consumer.subscribe(['kafkaSender'])  # Remplacez par le nom de votre topic Kafka

    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break
        data = json.loads(msg.value().decode('utf-8'))
        socketio.emit('update_data', data)

if __name__ == '__main__':
    kafka_thread = threading.Thread(target=kafka_consumer)
    kafka_thread.start()

    socketio.run(app)
