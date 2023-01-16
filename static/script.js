
const socket = io('http://127.0.0.1:5000');
function updateUI(data) {
  console.log(data)
  // Mise à jour de l'élément HTML avec l'ID "temperature" avec les données reçues
  // document.getElementById('temperature').textContent = data;
}
// Gestion de l'événement "mqtt_message" envoyé par le serveur
socket.on('mqtt_message', function(data) {
    console.log(data)
    document.querySelector('#name').innerHTML = data.topic.split('/')[0]
   if(data.topic === 'bureau/humidity') {
    document.querySelector("#humidity").innerHTML = data.payload;
  }
  if(data.topic === 'bureau/temperature') {
    document.querySelector("#temperature").innerHTML = data.payload;
  }
  console.log('Données reçues du serveur:', data);
  // Mise à jour de l'interface utilisateur avec les données reçues
  // updateUI(data);
});
