const socket = io('http://127.0.0.1:5000');


const topicIdMap = {
    'chambre/humidity': 'chambre_humidity',
    'chambre/temperature': 'chambre_temperature',
    'bureau/humidity': 'bureau_humidity',
    'bureau/temperature': 'bureau_temperature'
};


function setTemperatureColor(elementId, temperature) {
   if (temperature >= 22 && temperature <= 26) {
        document.getElementById(elementId).style.color = '#22c55e';
    } else if (temperature >26 && temperature <=28) {
        document.getElementById(elementId).style.color = '#eab308';
    } else {
        document.getElementById(elementId).style.color = '#ef4444';
    }
}


function setHumidityColor(elementId, humidity) {
    if (humidity >= 20 && humidity <=55) {
        document.getElementById(elementId).style.color = 'green';
    } else if (humidity >= 55 && humidity <=60) {
        document.getElementById(elementId).style.color = 'yellow';
    }else {
        document.getElementById(elementId).style.color = 'red';
    }
}

socket.on('mqtt_message', function (data) {
    console.log(data)
    const elementId = topicIdMap[data.topic];
    if (elementId) {
        document.getElementById(elementId).innerHTML = data.payload;
        if(elementId.includes("temperature")){
            setTemperatureColor(elementId,data.payload)
        }else if (elementId.includes("humidity")){
            setHumidityColor(elementId,data.payload)
        }
    } else {
        console.log(`Received message for unknown topic: ${data.topic}`)
    }
});

// function updateUI(data) {
//     console.log(data)
//     // Mise à jour de l'élément HTML avec l'ID "temperature" avec les données reçues
//     // document.getElementById('temperature').textContent = data;
// }
//
// // Gestion de l'événement "mqtt_message" envoyé par le serveur
// socket.on('mqtt_message', function (data) {
//     // console.log(data)
//     // document.querySelector('#name').innerHTML = data.topic.split('/')[0]
//     // if (data.topic === 'bureau/humidity') {
//     //     humidity.innerHTML = data.payload;
//     //     if (+data.payload > 70) {
//     //         humidity.classList.remove("text-red-500","text-yellow-500","text-green-700")
//     //         humidity.classList.add("text-red-500");
//     //     } else if (+data.payload > 60 && +data.payload <=70) {
//     //         humidity.classList.remove("text-red-500","text-yellow-500","text-green-700")
//     //         humidity.classList.add("text-yellow-500");
//     //     } else {
//     //         humidity.classList.remove("text-red-500","text-yellow-500","text-green-700")
//     //         humidity.classList.add("text-green-700");
//     //     }
//     // }
//     // if (data.topic === 'bureau/temperature') {
//     //     document.querySelector("#temperature").innerHTML = data.payload;
//     // }
//     console.log('Données reçues du serveur:', data);
//     // Mise à jour de l'interface utilisateur avec les données reçues
//     // updateUI(data);
// });
//
//
//
