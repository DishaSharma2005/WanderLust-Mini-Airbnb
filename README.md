
# 🌍 Wanderlust - Mini Airbnb Clone

Wanderlust is a full-stack travel accommodation web app inspired by Airbnb. It allows users to explore listings, view location on map, register/login, create new stays, leave reviews, and manage their listings.

> ⚠️ **Note:** This project is still a work in progress — future enhancements and polishing are planned!

Live Demo: [Visit Site](https://wanderlust-your-render-link.com)  
GitHub Repository: [Wanderlust Repo](https://github.com/DishaSharma2005/Wanderlust-Mini-Airbnb)

---

## ✨ Features

- ✅ User Authentication with Passport.js
- ✅ Add/Edit/Delete property listings
- ✅ Upload listing images via Cloudinary
- ✅ Geocode locations using OpenStreetMap API
- ✅ Interactive maps using Leaflet + OpenStreetMap
- ✅ Review system with ratings & comments
- ✅ Flash messages & form validations
- ✅ Responsive UI with Bootstrap
- ✅ Protected routes for logged-in users only

---

## 🛠 Tech Stack

| Category         | Tech Used                     |
|------------------|-------------------------------|
| 🌐 Frontend      | EJS, Bootstrap 5, Leaflet.js   |
| ⚙️ Backend       | Node.js, Express.js            |
| 🗄️ Database      | MongoDB, Mongoose              |
| 🔒 Auth          | Passport.js, express-session   |
| ☁️ Image Uploads | Cloudinary + Multer            |
| 📍 Maps & Geo    | OpenStreetMap + Nominatim API  |
| 🌐 Deployment    | Render                         |

---

## 📦 Installation

```bash
git clone https://github.com/DishaSharma2005/Wanderlust-Mini-Airbnb
cd Wanderlust-Mini-Airbnb
npm install
````

### 🔐 Environment Variables

Create a `.env` file in the root and add:

```
ATLAS_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SECRET=your_session_secret
NODE_ENV=development
```

---

## 🚀 Run Locally

```bash
node app.js
```

Then open your browser and visit:
[http://localhost:8080](http://localhost:8080)

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙋‍♀️ Author

Made with ❤️ by [Disha Sharma](https://github.com/DishaSharma2005)

