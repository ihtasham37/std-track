# StdTrack AI - Advanced Learning Roadmap Hub 

**StdTrack AI** is a production-ready web application built for the **Google Gemini 3 Hackathon**. It leverages the power of Google's Gemini 3 Pro model to generate hyper-personalized learning blueprints, university suggestions, scholarship opportunities, and career roadmaps.  

>  **Hackathon Context:** This project was developed specifically for participation in the Gemini 3 Hackathon to demonstrate AI-powered personalized learning and career guidance solutions.

---

##  Key Features

- **Four Specialized AI Modes**:
  - **Skill Architect**: Generates curated learning paths with YouTube and platform resources.  
  - **University Scout**: Identifies top global institutions matching your academic goals.  
  - **Scholarship Finder**: Locates financial aid and global scholarship opportunities.  
  - **Job Agent**: Provides tailored job role suggestions and career strategy.  
- **Neural Interface (Chat)**: Deep-dive into any suggestion with a real-time AI Academic Advisor.  
- **Persistent Memory**: Full Firebase integration allows you to save your profile and operation history.  
- **Identity Hub**: Manage your profile and rotate secure authentication passkeys.  
- **Export Capabilities**: Download any generated roadmap as a structured `.txt` report.  
- **Production Optimized**: Built with React 19, Tailwind CSS, and optimized for zero-configuration Netlify deployment.  

---

##  Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS  
- **Icons**: Lucide React  
- **AI Engine**: Google Gemini 3 Pro (`@google/genai`)  
- **Backend/Auth**: Firebase (Authentication & Realtime Database)  
- **Deployment**: Netlify  

---

##  Local Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd stdtrack-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Add Your Firebase Configuration** *(Optional but recommended for full functionality)*:
   - Open `src/services/firebase.ts` (create if missing).  
   - Replace with your own Firebase project credentials:
     ```ts
     import { initializeApp } from "firebase/app";
     import { getDatabase } from "firebase/database";

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };

     const app = initializeApp(firebaseConfig);
     export const database = getDatabase(app);
     ```
   - This ensures you have full control over user data and persistent storage.

4. **Configure Environment Variables**:
   - The app requires a Google AI Studio API Key. Ensure your environment provides `process.env.API_KEY` for local development.

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

##  Netlify Deployment (Step-by-Step)

1. Upload your code to GitHub (do not include `.env` files with real API keys).  
2. Connect your GitHub repo to [Netlify](https://app.netlify.com/).  
3. Set Build command: `npm run build`  
4. Set Publish directory: `dist`  
5. Add Environment Variable:  
   - Key: `API_KEY`  
   - Value: `YOUR_GEMINI_API_KEY_HERE`  
6. Deploy and enjoy your live site!

---

##  Security Note

- Always use your own Firebase configuration for production to retain full control of user data.  
- Do not commit sensitive keys to public repositories.  

---

##  License

MIT License — Feel free to use and modify for personal, hackathon, or commercial projects.  

---

> **Hackathon Ready:** Users can now clone this project, add their Firebase credentials, and participate in AI hackathons or build their own learning roadmap apps using Gemini 3.
