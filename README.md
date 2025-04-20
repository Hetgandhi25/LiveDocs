# LiveDocs
**Real-Time Collaborative Document Editor**

**Course:** Distributed Systems - IT559  
**Team ID:** 4  
**Prof.** Amit Mankodi

**Team Members:**  
- Dhrudeep Sharma (202201150)  
- Het Gandhi (202201167)  
- Jaimin Prajapati (202201228)

---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [System Architecture & Components](#system-architecture--components)  
3. [Distributed System Concepts Applied](#distributed-system-concepts-applied)  
4. [Implementation Details](#implementation-details)  
5. [Challenges & Solutions](#challenges--solutions)  
6. [Results & Performance Analysis](#results--performance-analysis)  
7. [Future Improvements](#future-improvements)  
8. [Setup Instructions](#setup-instructions)  
9. [Folder Structure](#folder-structure)  
10. [Usage](#usage)  
11. [Contributing](#contributing)  
12. [License](#license)

---

## Project Overview

### Problem Statement
In modern collaborative environments, multiple users need to edit documents simultaneously in real time, regardless of their location. Traditional text editors fail to provide seamless multi‑user collaboration, leading to issues such as inconsistent document states, conflicts due to concurrent edits, and system failures causing data loss.

### System Overview
The proposed real‑time collaborative document editor allows multiple users to create, edit, and share documents concurrently from any location. Key features include:
1. **Real‑Time Editing:** Utilizes WebSockets to broadcast changes instantly to all connected clients.  
2. **Distributed Storage:** Uses replication and distributed storage techniques to ensure data availability and persistence.  
3. **Concurrency Control:** Achieved implicitly via Socket.IO’s real‑time update mechanism.  
4. **Security & Access Control:** Offers role‑based document sharing permissions.

---

## System Architecture & Components

![Architecture Diagram](docs/architecture.png) _(add your architecture diagram to `docs/architecture.png`)_

**Components:**
- **Clients (Frontend):** React + TypeScript application running in browsers.  
- **Server (Backend):** Node.js + Express application handling API requests and Socket.IO connections.  
- **WebSockets Layer:** Socket.IO for bidirectional real‑time communication.  
- **Database:** MongoDB for persistent document storage, with replication enabled for high availability.

---

## Distributed System Concepts Applied
1. **Real‑Time Synchronization:** Every change is propagated instantly across all clients, ensuring a consistent document state.  
2. **Concurrent Multi‑User Collaboration:** Allows multiple users to edit the same document at once without blocking each other.  
3. **Replication:** Documents are replicated across multiple database nodes to ensure high availability and data integrity.  
4. **Fault Tolerance:** Automatic failover and redundant nodes keep the service running even if one server fails.  
5. **Access Control:** Role‑based permissions manage who can view or edit documents, protecting sensitive data.

---

## Implementation Details

### Frontend
- **Framework:** React.js with TypeScript for strongly‑typed UI development.  
- **Editor:** Quill.js rich‑text editor for document editing.  
- **Export:** `docx` + `FileSaver.js` to export documents as `.docx` files.  
- **Styling:** Responsive UI using CSS (e.g., Tailwind or Bootstrap).

### Backend
- **Runtime:** Node.js with Express framework.  
- **Real‑Time:** Socket.IO for bi‑directional WebSocket communication.  
- **Language:** TypeScript for type safety on both client and server.  
- **Database:** MongoDB with replication set up for persistence and high availability.

### APIs & Libraries
- **Socket.IO API:** Emits and listens to real‑time document change events.  
- **Quill API:** Handles text‑change events and delta operations.  
- **docx API:** Converts editor content into Word documents.

---

## Challenges & Solutions
1. **Real‑Time Synchronization & Concurrency**  
   - *Challenge:* Conflicting edits when multiple users update the same document segment.  
   - *Solution:* Socket.IO broadcasts deltas and applies them in sequence; Quill’s operational transformation ensures convergence.

2. **Replication & Fault Tolerance**  
   - *Challenge:* Keeping replicas consistent during frequent updates or node failures.  
   - *Solution:* MongoDB replication sets with automatic failover and write concerns to guarantee data consistency.

---

## Results & Performance Analysis
Data and performance benchmarks are available in the [Demo section](docs/demo/) of the submission. Key highlights:
- Low end‑to‑end latency (<100 ms) for real‑time edits with 50 concurrent users.  
- Recovery from a single node failure within 5 seconds without data loss.

---

## Future Improvements
1. **Enhanced Collaboration Tools:** Add images, video embedding, real‑time commenting, undo/redo, and multi‑cursor indicators.  
2. **AI‑Powered Assistance:** Integrate grammar checking, summarization, and predictive text via ML services.  
3. **Security Upgrades:** Implement OAuth2 / JWT refresh tokens and enforce SSL/TLS for all communication.

---

## Setup Instructions

### Backend Setup
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create .env and configure environment variables
cat <<EOF > .env
DATABASE_URL=<your MongoDB URI>
CLIENT_ORIGIN=http://localhost:5173
EOF

# Start development server
npm run dev
```
The backend will run at: `http://localhost:3000`

### Frontend Setup
```bash
# In a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Create .env and configure
cat <<EOF > .env
VITE_SERVER_URL=http://localhost:3000
EOF

# Start React app
npm run dev
```
The frontend will run at: `http://localhost:5173`

---

## Folder Structure
```
LiveDocs/
├── server/            # Backend (Express + Socket.IO)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── .env
└── client/            # Frontend (React + Quill)
    ├── public/
    ├── src/
    └── .env
```

---

## Usage
1. Ensure backend and frontend are running.  
2. Open `http://localhost:5173` in your browser.  
3. Sign up or log in, create or join a document, and start editing collaboratively.

---

## Contributing
Contributions are welcome! Please fork the repo and open a pull request with your changes. Follow code style and include tests where appropriate.

