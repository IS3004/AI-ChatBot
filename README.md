# 🤖 Full-Stack AI ChatBot

A production-ready ChatBot built with **React + Vite**, **Node.js/Express**, **MongoDB**, **Gemini AI** , **Clerk** authentication, and **ImageKit** for image uploads.

> **Security**: The Gemini API key lives exclusively on the server. The client never touches it. Gemini is called server-side and responses are streamed back via SSE.

---

## ✨ Features

- 💬 **AI Chat** — Streaming responses powered by Google Gemini 1.5 Flash
- 🖼️ **Image Understanding** — Upload images and ask Gemini Vision questions about them
- 🔐 **Authentication** — Sign up / sign in with Clerk (Google, GitHub, email)
- 📋 **Persistent History** — All chats saved to MongoDB, visible in the sidebar
- ✨ **Markdown Rendering** — Code blocks, tables, bold, lists beautifully formatted
- 🎨 **Dark Theme** — Polished ChatGPT-style UI

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | CSS (custom dark theme) |
| Routing | react-router-dom v6 |
| State | TanStack React Query |
| Auth | Clerk |
| AI | Gemini 3.5 — server-side |
| Images | ImageKit |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |

---

## 🚀 Quick Start

### 1. Get your API keys

| Service | Where to get it | Free? |
|---|---|---|
| **Gemini** | [console.Gemini.com](https://console.Gemini.com) → API Keys | ✅ Free |
| **Clerk** | [clerk.com](https://clerk.com) → Create App | ✅ Yes |
| **ImageKit** | [imagekit.io](https://imagekit.io) → Settings → API Keys | ✅ Yes |
| **MongoDB** | [mongodb.com/atlas](https://mongodb.com/atlas) → Connect | ✅ Free tier |


---

### 2. Configure environment variables

#### `server/.env`
```env
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/aichat
CLIENT_URL=http://localhost:5173
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
Gemini_API_KEY=AQ-...
```

#### `client/.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your_id
VITE_IMAGE_KIT_PUBLIC_KEY=public_...
VITE_API_URL=http://localhost:3000
```

> **Clerk**: In your Clerk dashboard, add `http://localhost:5173` as an **Allowed Origin** and set the sign-in/up redirect URLs.

---

### 3. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Run the app

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
ai-chatBot/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatList.jsx   # Sidebar with chat history
│   │   │   ├── NewPrompt.jsx  # Main chat input + message thread
│   │   │   └── Upload.jsx     # ImageKit upload widget
│   │   ├── layouts/
│   │   │   ├── RootLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── routes/
│   │   │   ├── HomePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── SignInPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   └── lib/
│   │       └── gemini.js      # Gemini SDK config
│   └── .env
│
└── server/                    # Express backend
    ├── models/
    │   ├── chat.js            # Chat schema (messages)
    │   └── userChats.js       # User's chat index
    ├── routes/
    │   ├── chats.js           # Create/get chat
    │   ├── userChats.js       # List chats for sidebar
    │   ├── messages.js        # Append messages
    │   └── imagekit.js        # ImageKit auth endpoint
    ├── middlewares/
    │   └── clerkAuth.js       # Clerk JWT verification
    ├── index.js
    └── .env
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set root to `client/`, add all `VITE_*` env vars

### Backend → Render
1. Create a new **Web Service** in [render.com](https://render.com)
2. Set root to `server/`, build command `npm install`, start command `npm start`
3. Add all server env vars
4. Update `VITE_API_URL` in client to your Render URL

---

## 📝 License
MIT — free to use for personal and commercial projects.
