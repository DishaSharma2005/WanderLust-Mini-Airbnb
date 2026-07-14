const CATEGORIES = [
  { name: "Trending", icon: "fa-solid fa-fire" },
  { name: "Rooms", icon: "fa-solid fa-bed" },
  { name: "Cities", icon: "fa-solid fa-mountain-city" },
  { name: "Mountains", icon: "fa-solid fa-mountain" },
  { name: "Castles", icon: "fa-brands fa-fort-awesome" },
  { name: "Amazing Pools", icon: "fa-solid fa-person-swimming" },
  { name: "Camping", icon: "fa-solid fa-tree" },
  { name: "Farms", icon: "fa-solid fa-wheat-awn" },
  { name: "Arctic", icon: "fa-solid fa-snowflake" },
];

module.exports = { CATEGORIES, CATEGORY_NAMES: CATEGORIES.map((c) => c.name) };
