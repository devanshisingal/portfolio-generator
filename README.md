# 🌌 Galaxy Portfolio Generator

An immersive, space-themed AI-powered portfolio platform that enables developers to instantly create, customize, analyze, and optimize their professional portfolios. Built with a futuristic dark "Cosmic" visual aesthetic and integrated with advanced Gemini AI intelligence.

---

## 🚀 Key Modules & Features

### 🌟 1. Live Customization Studio
* **Interactive Control Center**: Switch between multiple stylized design themes (Galaxy, Cyberpunk Retro, Minimalist, Terminal) on the fly.
* **Granular Edits**: Real-time side-by-side editing of contact information, bios, education, skills, and projects with immediate visual feedback.

### 🤖 2. RAG-Powered Recruiter Interrogator
* **Direct Q&A Session**: An embedded chatbot where recruiters can ask specific questions about the candidate's background, projects, or readiness.
* **Contextual Responses**: Leveraging the Gemini API to respond with precise alignment to the portfolio state and candidate information.

### 🔍 3. GitHub Repository Inspector
* **Structure & Complexity Audits**: Input any public GitHub repository to receive high-level software architectural models, identified design trade-offs, tech stacks, and modular complexity ratings.
* **Custom Inquiries**: Recruiters or candidates can ask custom questions about specific aspects of the codebase.

### 🎯 4. AI Mock Interview Deck
* **Track Simulations**: Choose from multiple practice paths including Frontend/UI-UX, Backend/System Design, and General Behavioral/Leadership.
* **Diagnostic Scoring**: Get immediate scores out of 100 on candidate responses along with strengths, weaknesses, and model answers from the AI evaluator.

### 📊 5. ATS Resume Optimizer
* **Google XYZ Formula**: Reconstitution of simple resume bullet points into high-impact, metrics-driven outcomes (*Accomplished [X] as measured by [Y] by doing [Z]*).
* **Estimated Score Increase**: Interactive visual telemetry showing potential ATS score improvements with alternative metric variations.

### 📋 6. Recruiter Radar View
* **High-Density Summary**: Optimized layout designed specifically for fast recruiter onboarding.
* **Grouped Skill Indices**: Automated categorization of skills into Languages, Frameworks/Libraries, and Databases/Infrastructure.
* **Plain Text Export**: Instant single-click generation of beautifully formatted markdown resumes.

---

## 🛠️ Technology Stack

* **Frontend**: React 18 with TypeScript, powered by Vite.
* **Styling**: Tailwind CSS for high-fidelity interactive elements, custom ambient glowing gradients, and fluid typography.
* **Animations**: Framer Motion (`motion/react`) for smooth page transitions and micro-interactions.
* **Icons**: Feather-light, consistent iconography via `lucide-react`.
* **Backend**: Express server running on Node.js to secure third-party integration routes.
* **AI Engine**: Google GenAI SDK interfacing server-side with Gemini models.

---

## ⚙️ Setup & Installation

### 1. Environment Variables
To get the application up and running, copy the `.env.example` template and define your server-side API keys:
```env
# Create a .env file and define:
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies
Install all required npm packages from `package.json`:
```bash
npm install
```

### 3. Start Development Server
Boot the custom Express + Vite server locally on port `3000`:
```bash
npm run dev
```

### 4. Build for Production
Bundle the production assets and compile the server entry point using `esbuild`:
```bash
npm run build
```
The application compiles into the `dist/` directory and can be executed via:
```bash
npm start
```
