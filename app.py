from flask import Flask, render_template
from flask_mqtt import Mqtt
from flask_socketio import SocketIO
import time
app = Flask(__name__)
app.config['MQTT_BROKER_URL'] = '192.168.0.210'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = ''
app.config['MQTT_PASSWORD'] = ''
app.config['MQTT_KEEPALIVE'] = 5
app.config['MQTT_TLS_ENABLED'] = False

mqtt = Mqtt(app)
socketio = SocketIO(app)


@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.init_app(app)
    mqtt.subscribe('bureau/humidity')
    mqtt.subscribe('bureau/temperature')


@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    if message.topic == 'bureau/humidity':
        socketio.emit('mqtt_message', data=data)

    if message.topic == 'bureau/temperature':
        socketio.emit('mqtt_message', data=data)


@app.route('/')
def index():
    try:
        mqtt.init_app(app)
        time.sleep(5)
        mqtt.subscribe('bureau/humidity')
        mqtt.subscribe('bureau/temperature')
    except OSError:
        print("erreur")
        return render_template('error.html', error_message="Serveur MQTT Indisponible")
    return render_template('index.html')


if __name__ == '__main__':
    socketio.run(app)
