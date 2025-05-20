# Ticket App 🎫

An automated ticketing system that processes user queries from multiple platforms (email, WhatsApp), classifies them using a machine learning model, and displays them on a frontend dashboard.

## 🧱 Project Structure

- `backend/` — Spring Boot application (your contribution)
- `frontend/` — React application for UI
- `python-bot/` — Python scripts for email/WhatsApp automation and classification

## 🌟 My Contributions
🔹 Frontend Development (React + Bootstrap)
Designed and developed a responsive, user-friendly dashboard using React.
Implemented ticket display UI that dynamically fetches data from the Spring Boot REST API.
Integrated dark mode support using Bootstrap 5 and custom theming.
Built a statistics section using interactive pie charts and maps for visual insights into ticket categories and geographic distribution.
Added support for routing using react-router-dom for better navigation.

🔹 Python-Based AI Model
Developed a Natural Language Processing (NLP) based classification model in Python to:
Extract relevant data from incoming support emails.
Automatically classify tickets into predefined categories (e.g., Billing, Technical Support, Feedback, etc.).
Used libraries like scikit-learn, NLTK, and pandas for preprocessing and model training.
Integrated the model with the backend to enable real-time classification on new ticket entries.

##🛠️ Tech Stack
🎯 Frontend (My contribution)
React.js – UI library for building interactive user interfaces
React Router DOM – Routing and navigation
Bootstrap 5 – Responsive design and dark mode support
Chart.js / Recharts – Pie charts and graphical ticket statistics
Axios / Fetch API – Data fetching from backend APIs
React Bootstrap – Bootstrap components in React

⚙️ Backend (Integration)
Spring Boot – RESTful API services to manage ticket data
MySQL / PostgreSQL – (Assumed) Database for ticket storage

🤖 Machine Learning Model (Python with Hugging Face)
Python 3

Transformers (Hugging Face) – Pretrained NLP models for ticket classification (e.g., BERT, DistilBERT)
Tokenizers – Efficient text tokenization
Torch / TensorFlow – Model training/inference (based on framework used)
pandas / NumPy – Data handling
FastAPI / Flask – API layer to serve the model to the frontend/backend
Hugging Face Hub – For accessing and deploying pretrained models

🔗 Tools & Services
Git & GitHub – Version control and collaboration
Visual Studio Code – Code editor
Postman – API testing
Hugging Face Inference API –  Model deployment and hosting

