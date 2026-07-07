# GrowEasy CRM Importer 🚀

An AI-powered CSV data extraction and management tool. This application allows users to upload raw lead data via CSV, processes it in chunks using Google's Gemini AI to extract structured CRM fields, and displays the results in a highly performant, virtualized data table.

## ✨ Features
* **Smart AI Extraction:** Uses Gemini 1.5 Flash to automatically clean, map, and format raw CSV data into a strict JSON CRM schema.
* **Resilient Batch Processing:** Implements chunking and exponential backoff retries to handle large files without hitting API rate limits.
* **High-Performance UI:** Utilizes `@tanstack/react-virtual` to render massive data sets smoothly without crashing the browser.
* **Modern Dashboard:** Built with Next.js and Tailwind CSS v4, featuring a responsive sidebar, drag-and-drop file uploading, and full Light/Dark mode support.
* **Production Ready:** Separated frontend and backend architecture designed for seamless deployment on Vercel and Render.

## 🛠️ Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS v4, Lucide Icons, PapaParse, TanStack Table & Virtualizer, Next-Themes.
* **Backend:** Node.js, Express, TypeScript, Google Generative AI SDK, Cors, Dotenv.

---

## 🚀 Local Setup Instructions

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a .env file in the backend folder and add your Gemini API key:

PORT=5000
GEMINI_API_KEY=your_actual_api_key_here
Start the backend development server:

```Bash
npm run dev
```
The server will start on http://localhost:5000.

2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:

```Bash
cd frontend
npm install
```
Start the Next.js development server:  

```Bash
npm run dev
```
The application will be available at http://localhost:3000.  

🌍 Deployment Options  
Backend (Render): Deploy as a Web Service. Set the root directory to backend, use npm install && npx tsc for the build command, and node dist/index.js for the start command. Don't forget to add your GEMINI_API_KEY to the environment variables!  

Frontend (Vercel): Import the repository, set the root directory to frontend, and deploy. Ensure the fetch URL in page.tsx points to your live Render backend URL instead of localhost.
