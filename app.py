from flask import Flask, render_template
from flask_cors import CORS
from flask_mqtt import Mqtt
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['MQTT_BROKER_URL'] = '192.168.0.210'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = ''
app.config['MQTT_PASSWORD'] = ''
app.config['MQTT_KEEPALIVE'] = 5
app.config['MQTT_TLS_ENABLED'] = False

mqtt = Mqtt(app, connect_async=True)
socketio = SocketIO(app)


@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.init_app(app)
    mqtt.subscribe('#')
    # mqtt.subscribe('bureau/temperature')


@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    socketio.emit('mqtt_message', data=data)
    # if message.topic == 'bureau/humidity':
    #     socketio.emit('mqtt_message', data=data)
    #
    # if message.topic == 'bureau/temperature':
    #     socketio.emit('mqtt_message', data=data)


@app.route('/')
def index():
    try:
        return render_template('main.html')
    except OSError:
        return render_template('error.html')


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", debug=True, use_reloader=True)
