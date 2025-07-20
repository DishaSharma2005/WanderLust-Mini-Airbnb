
//   const map = L.map('map').setView([28.6139, 77.2090], 13); // Change to your coordinates

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors'
//   }).addTo(map);

//   L.marker([28.6139, 77.2090]).addTo(map)
//     .bindPopup('Marker Location')
//     .openPopup();
const coordinates = window.listingCoordinates;
document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('map').setView([28.6139, 77.2090], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([28.6139, 77.2090]).addTo(map)
    .bindPopup('Marker Location')
    .openPopup();
});

if (coordinates && coordinates.length === 2) {
  const map = L.map('map').setView([coordinates[1], coordinates[0]], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup('Exact location will be shared after booking!')
    .openPopup();
}
