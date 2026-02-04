# StdTrack AI - Advanced Learning Roadmap Hub

StdTrack AI is a production-ready web application that leverages the power of Google's Gemini 3 Pro model to generate hyper-personalized learning blueprints, university suggestions, scholarship opportunities, and career roadmaps.

## 🚀 Key Features

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

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **AI Engine**: Google Gemini 3 Pro (`@google/genai`)
- **Backend/Auth**: Firebase (Authentication & Realtime Database)
- **Deployment**: Netlify

## ⚙️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd stdtrack-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   The app requires a Google AI Studio API Key. For local development, ensure your environment provides `process.env.API_KEY`.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🌐 Netlify Deployment (Step-by-Step)

This project is specifically architected to work on Netlify without needing a `_redirects` file, thanks to its state-driven navigation system.

### 1. Upload to GitHub
- Create a new repository on GitHub.
- Push your local files to the repository.
- **Note**: Do not upload a `.env` file containing your real API keys.

### 2. Connect to Netlify
- Log in to your [Netlify Dashboard](https://app.netlify.com/).
- Click **Add new site** > **Import an existing project**.
- Select **GitHub** and authorize the repository.

### 3. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 4. Environment Variables (CRITICAL)
- Go to **Site Configuration** > **Environment variables**.
- Add a new variable:
  - **Key**: `API_KEY`
  - **Value**: `YOUR_GEMINI_API_KEY_HERE`
- *Note: Without this key, the AI generation will fail and show a descriptive error banner.*

### 5. Deploy
- Click **Deploy site**.
- Once the build is finished, your site is live!

## 🔐 Security Note

The application uses a pre-configured Firebase instance. For a production environment, it is recommended to replace the configuration in `src/services/firebase.ts` with your own Firebase project credentials to ensure you have full control over your user data.

## 📄 License

MIT License - Feel free to use and modify for your personal or commercial projects.