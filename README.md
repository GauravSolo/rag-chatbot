# RAG Chatbot

This repository contains a Retrieval-Augmented Generation (RAG) Chatbot, built using a Node.js backend, a React frontend, ChromaDB for vector storage, and Redis for session history.

---

## 🚀 Architecture
<img width="1529" height="711" alt="2025-09-19 04 46 54 app eraser io 8e981a710f02" src="https://github.com/user-attachments/assets/1abad92d-f614-4472-bace-ddc7cc07f33a" />

## 🚀 Project structure
```
/rag-chatbot
├── backend
├── frontend
├── docker-compose.yml
└── render.yml
```

- **backend/**: Node.js API server – handles embedding retrieval, chat history, etc.  
- **frontend/**: React app (chat interface).  
- **docker-compose.yml**: Local development setup.  
- **render.yml**: Blueprint/Config for rendering this app on Render.

---

## 📽 Demo

- **Video Walkthrough** → [[link to demo video] ](https://drive.google.com/file/d/1_MOAaj7umjZwiS1hcg9W14iBTqPjH0eD/view?usp=drive_link) 
- **Live Deployment** → [[rag chatbot]](https://rag-frontend-chj4.onrender.com)  
<img width="685" height="792" alt="2025-09-19 15 25 23 rag-frontend-chj4 onrender com d4b4e2a900c4" src="https://github.com/user-attachments/assets/eff5a8fd-f151-4891-9bf7-bbdff99f37b8" />

---

## 🧰 Tech Stack

- React.js  
- Node.js / Express.js  
- ChromaDB  
- Redis  
- Docker & Docker Compose  
- Gemini API / Jina for embeddings  
- Render (for deployment)  

---

## 🛠 Local Setup

1. Clone this repo  
   ```bash
   git clone https://github.com/GauravSolo/rag-chatbot.git
   cd rag-chatbot
   ```

2. Create `.env` files  

### backend:
```
REDIS_HOST=<your-redis-host>
REDIS_PORT=<your-redis-port>
JINA_API_KEY=<your-jina-api-key>
GEMINI_API_KEY=<your-gemini-api-key>
CHROMA_HOST=<your-chroma-host>
```

### frontend:
```
REACT_APP_API=<backend-api-url>
```

3. Start services using Docker Compose:
```bash
docker compose up -d --build
```

---

## 🐳 Docker Setup  

<---------- Creating Docker Images ----------->  

1. **Create network**  
```bash
docker network create rag-network
```  

2. **Frontend**  
```bash
docker build -t rag-frontend-image ./frontend
```  

3. **Redis**  
```bash
docker pull redis
```  

4. **Volume for ChromaDB**  
```bash
docker volume create chroma-data
```  

5. **ChromaDB**  
```bash
docker pull chromadb/chroma
```  

6. **Backend**  
```bash
docker build -t rag-backend-image ./backend
```  

---  

<------------ Running Docker Containers ----------->  

1. **Redis**  
```bash
docker run -d --name myredis --network rag-network redis
```  

2. **ChromaDB**  
```bash
docker run -dp 8000:8000 -v chroma-data:/data --name chromadb --network rag-network chromadb/chroma
```  

3. **Frontend**  
```bash
docker run -dp 3001:80 --name rag-frontend --network rag-network rag-frontend-image
```  

4. **Backend**  
```bash
docker run -dp 5001:3000 --name rag-backend --network rag-network rag-backend-image
```  

---

## 🎯 Deployment

Use Render services (backend, frontend, ChromaDB, Redis) with environment variables set in Render Dashboard.

Blueprint: `render.yml` in repo.

Update `.env` or Render env vars for hostnames of production services.

---

## ✅ Features

- Persistent chat history per session  
- Embeddings stored in Chroma  
- Retrieval of relevant context for each user query  
- Reset session & fetch history  

---

## 🔮 Future Improvements

- Better error handling for unavailable Redis/Chroma  
- More advanced caching strategies  
- UI/UX
---

## 📚 License & Contact

Feel free to reach out at gauravsharma9339@gmail.com for questions.
