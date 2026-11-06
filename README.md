# Air Grab

Send an image from one device to another with a hand gesture. Pick an image, make a **grab** gesture at your camera to "pick it up", then make a **drop** gesture on the other device to receive it.

Gesture detection runs entirely in the browser using a Teachable Machine model, so no video ever leaves your device. Only the selected image is uploaded when a grab is detected.

**Live demo:** https://air-grab.netlify.app

> **Note:** the backend runs on Render's free tier and goes to sleep after a period of inactivity. The first request after that can take 30 to 60 seconds, so your first grab or drop may fail or hang. Open https://air-grab.onrender.com/health first to wake it up, then try again.

## How it works

1. The user opens the **Home** page and selects an image.
2. The webcam feed is classified in the browser (ml5.js + a Teachable Machine model) into `grab`, `drop`, or `none`.
3. On a confident **grab**, the image is uploaded to the server and stored under the sender's ID.
4. On the **Drop** page of a friend's device, a confident **drop** gesture requests the image from the server.
5. The server checks the friend mapping, returns the image path, and removes it from the cache so it can only be received once.

## Tech stack

**Client**
- React (Vite)
- Tailwind CSS
- React Router
- lucide-react (icons)
- ml5.js (image classifier) with a Teachable Machine model

**Server**
- Node.js + Express
- Multer (file uploads)
- CORS

## Project structure

```
air-grab/
├── client/               # React app
│   └── src/
│       ├── App.jsx
│       ├── GestureDetector.jsx   # camera + model, reports gesture and confidence
│       ├── HomePage.jsx          # select an image, grab gesture
│       └── DropPage.jsx          # drop gesture, receive image
├── server/
│   └── index.js          # Express API
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A webcam
- A modern browser (Chrome, Edge, Firefox, Safari)

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/air-grab.git
cd air-grab
```

### 2. Run the server

```bash
cd server
npm install
node index.js
```

The server starts on `http://localhost:5000`. Check `http://localhost:5000/health` to confirm it is running.

### 3. Run the client

```bash
cd client
npm install
npm run dev
```

The app starts on `http://localhost:5173`.

### 4. Load ml5

The classifier uses `window.ml5`, so the script must be included in `client/index.html`:

```html
<script src="https://unpkg.com/ml5@1/dist/ml5.min.js"></script>
```

## Environment variables

**Client** (`client/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the backend | `http://localhost:5000` |

**Server** (`server/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Port to listen on | `5000` |
| `CLIENT_URL` | Deployed frontend URL, allowed by CORS | `https://your-app.vercel.app` |

Commit `.env.example` files with placeholder values, never the real `.env`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/upload` | Upload an image. Multipart form with fields `image` (file) and `userId`. Returns `{ success, imagePath }`. |
| `GET` | `/drop/:receiverId` | Returns the image uploaded by the receiver's friend, then deletes it from the cache. Returns `{ success, imagePath }`. |
| `GET` | `/uploads/:filename` | Serves an uploaded image. |
| `GET` | `/health` | Health check. |

## Gesture model

The model is a Teachable Machine image project exported to TensorFlow.js, with three classes:

| Label | Meaning |
| --- | --- |
| `grab` | Closed fist, triggers an upload on the Home page |
| `drop` | Open hand, triggers a download on the Drop page |
| `none` | No gesture |

Triggers require a confidence above `0.7` and have a 10 second cooldown to prevent repeated sends. To use your own model, replace `MODEL_URL` in `GestureDetector.jsx`. Class names must match exactly.

## Known limitations

- **Fixed user IDs.** Users are currently hardcoded (`id1`, `id2`) and paired through a fixed friend map on the server. Two real users need different IDs.
- **In-memory state.** The friend map and image cache are JavaScript `Map`s, so they reset when the server restarts.
- **Public uploads.** Files in `/uploads` are served statically, so anyone with the exact URL can view them.
- **Ephemeral storage.** Free hosting tiers often wipe the disk on restart, so uploaded files may disappear.
- **Cold starts.** The free-tier backend sleeps when idle, so the first request after a quiet period is slow.
- **Single-frame classification.** The model classifies static poses and can be sensitive to lighting and background. Train with varied samples for better accuracy.

  ## License

  MIT. See [LICENSE](LICENSE) for details.