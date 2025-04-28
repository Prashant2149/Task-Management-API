# 📋 Task Management API

A simple and scalable Task Management API built with **Node.js**, **Express.js**, **MongoDB**, **Redis**, and **BullMQ**.

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Redis (for queueing)
- BullMQ (job queues)
- Docker (for MongoDB and Redis containers)

---

## 📂 Project Structure

```text
src/
├── config/
│   └── db.js
│   └── redis.js
├── controllers/
│   ├── auth.controller.js
│   ├── task.controller.js
│   └── notification.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── validate.middleware.js
│   └── error.middleware.js
├── models/
│   ├── user.model.js
│   ├── task.model.js
│   ├── taskHistory.model.js
│   ├── taskComment.model.js
│   └── notification.model.js
├── routes/
│   ├── auth.routes.js
│   ├── task.routes.js
│   └── notification.routes.js
├── services/
│   ├── token.service.js
│   ├── cache.service.js
│   ├── notification.service.js
├── workers/
│   └── notification.worker.js
├── queues/
│   └── notification.queue.js
├── utils/
│   └── response.js
│   └── logger.js
└── server.js

📢 Features
	•	Secure authentication with JWT tokens
	•	Task assignment to multiple users
	•	Redis-based background job queue (BullMQ) for sending notifications
	•	Dockerized MongoDB and Redis setup
	•	Clean architecture with separation of concerns
	•	Proper error handling middleware
	•	Input validation middleware

    
![alt text](image.png)