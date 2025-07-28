
// const coordinates = window.listingCoordinates;
// document.addEventListener('DOMContentLoaded', function () {
//   const map = L.map('map').setView([28.6139, 77.2090], 13);

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors'
//   }).addTo(map);

//   L.marker([28.6139, 77.2090]).addTo(map)
//     .bindPopup('Marker Location')
//     .openPopup();
// });

// if (coordinates && coordinates.length === 2) {
//   const map = L.map('map').setView([coordinates[1], coordinates[0]], 13);

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors'
//   }).addTo(map);

//   L.marker([coordinates[1], coordinates[0]])
//     .addTo(map)
//     .bindPopup('Exact location will be shared after booking!')
//     .openPopup();
// }
const coordinates = window.listingCoordinates;

document.addEventListener('DOMContentLoaded', function () {
  if (!coordinates || coordinates.length !== 2) return;

  const lat = coordinates[1];
  const lng = coordinates[0];

  const map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup('Exact location will be shared after booking!')
    .openPopup();

  // Set Google Maps link
  const gmapsLink = document.getElementById('gmaps-link');
  if (gmapsLink) {
    gmapsLink.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
});
