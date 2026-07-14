
# 🌍 Wanderlust - Mini Airbnb Clone

Wanderlust is a full-stack travel accommodation web app inspired by Airbnb. It allows users to explore listings, view location on map, register/login, create new stays, leave reviews, and manage their listings.

> ⚠️ **Note:** This project is still a work in progress — future enhancements and polishing are planned!

Live Demo: [Visit Site](https://wanderlust-mini-airbnb.onrender.com)  
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

## ☁️ Render free-tier note

On Render’s **free** plan, the web service sleeps after ~15 minutes with no traffic. The next visit can take **30–60+ seconds** (cold start).

This repo includes:
- `GET /health` — lightweight keep-alive endpoint  
- `.github/workflows/keep-alive.yml` — pings `/health` every 10 minutes  

After deploying the latest code, GitHub Actions will help keep the service warm.  
**Permanent fix:** upgrade the Render web service to a paid instance (no spin-down).

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙋‍♀️ Author

Made with ❤️ by [Disha Sharma](https://github.com/DishaSharma2005)

