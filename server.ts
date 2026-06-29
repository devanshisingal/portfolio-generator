/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize simple file-based database path
const DB_PATH = path.join(process.cwd(), "db.json");

// Ensure db.json exists with initial structure
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify({
      users: [],
      portfolios: {},
      analytics: {},
      interviews: {},
    }, null, 2)
  );
}

// Database helper functions
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { users: [], portfolios: {}, analytics: {}, interviews: {} };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Lazy-initialized Gemini API client
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Express middlewares
app.use(express.json({ limit: "10mb" }));

// Mock Auth API (Stored in db.json, password hashing simulated securely or using simple strings for mockup)
app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: "Name, email and password are required." });
    return;
  }

  const db = readDB();
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    res.status(400).json({ error: "Email already registered." });
    return;
  }

  const userId = crypto.randomUUID();
  const newUser = { id: userId, email, password, name };
  db.users.push(newUser);

  // Initialize an empty portfolio for the user with default space galaxy theme!
  const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const defaultPortfolio = {
    id: username,
    userId: userId,
    name: name,
    title: "Software Engineer",
    bio: "An aspiring developer passionate about building immersive digital experiences.",
    skills: ["TypeScript", "React", "Node.js", "Tailwind CSS"],
    projects: [
      {
        id: crypto.randomUUID(),
        title: "Orbital Task Manager",
        description: "A cosmic, space-themed drag-and-drop productivity dashboard.",
        techStack: ["React", "TypeScript", "Tailwind CSS"],
      }
    ],
    experience: [
      {
        id: crypto.randomUUID(),
        company: "Stellar Solutions",
        role: "Frontend Developer Intern",
        duration: "Jan 2025 - May 2025",
        description: "Developed galactic user interfaces and responsive web layouts.",
      }
    ],
    education: [
      {
        id: crypto.randomUUID(),
        school: "Galaxy University",
        degree: "Bachelor of Science in Computer Science",
        duration: "2021 - 2025",
      }
    ],
    contact: {
      email: email,
      github: `github.com/${username}`,
      linkedin: `linkedin.com/in/${username}`,
    },
    theme: "galaxy",
    fontClass: "font-space",
    primaryColor: "#a855f7", // purple-500
    secondaryColor: "#3b82f6", // blue-500
    isPublished: true,
  };

  db.portfolios[username] = defaultPortfolio;

  // Initialize analytics for the portfolio
  db.analytics[username] = {
    totalVisitors: 124,
    avgTimeSpentMin: 3.5,
    totalQuestions: 48,
    clickThroughRate: 15.6,
    visitorsOverTime: [
      { date: "Mon", visitors: 15, questionsAsked: 5, timeSpentSec: 180, projectClicks: 3 },
      { date: "Tue", visitors: 22, questionsAsked: 8, timeSpentSec: 210, projectClicks: 5 },
      { date: "Wed", visitors: 18, questionsAsked: 6, timeSpentSec: 190, projectClicks: 4 },
      { date: "Thu", visitors: 25, questionsAsked: 10, timeSpentSec: 240, projectClicks: 6 },
      { date: "Fri", visitors: 30, questionsAsked: 12, timeSpentSec: 220, projectClicks: 8 },
      { date: "Sat", visitors: 10, questionsAsked: 4, timeSpentSec: 150, projectClicks: 2 },
      { date: "Sun", visitors: 4, questionsAsked: 3, timeSpentSec: 120, projectClicks: 1 },
    ],
    mostViewedProjects: [
      { projectId: defaultPortfolio.projects[0].id, projectTitle: "Orbital Task Manager", views: 82 }
    ]
  };

  writeDB(db);

  res.json({
    user: { id: userId, email, name, username },
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const db = readDB();
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  // Find portfolio
  const portfolioEntry = Object.entries(db.portfolios).find(
    ([_, p]: any) => p.userId === user.id
  );
  const username = portfolioEntry ? portfolioEntry[0] : email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  res.json({
    user: { id: user.id, email: user.email, name: user.name, username },
  });
});

// Import & Generate AI Portfolio
app.post("/api/portfolio/onboard", async (req, res) => {
  const { userId, resumeText, githubUser, linkedinUrl, skills, projects, certifications } = req.body;

  if (!userId) {
    res.status(400).json({ error: "User ID is required." });
    return;
  }

  const db = readDB();
  // Find current username for this user
  const portfolioEntry = Object.entries(db.portfolios).find(
    ([_, p]: any) => p.userId === userId
  );
  if (!portfolioEntry) {
    res.status(404).json({ error: "User portfolio not found." });
    return;
  }

  const username = portfolioEntry[0];
  const originalPortfolio = portfolioEntry[1] as any;

  try {
    const ai = getGemini();
    const prompt = `
      You are a professional portfolio writer and builder. Based on the user's uploaded information, write a high-impact, beautifully polished personal profile, professional bio, select up to 8 of their best skills, structure up to 3 of their projects with clear tech stacks and descriptions, and write down up to 2 education history entries.
      
      User's resume text: "${resumeText || 'Not provided'}"
      GitHub user: "${githubUser || 'Not provided'}"
      LinkedIn URL: "${linkedinUrl || 'Not provided'}"
      Key skills list: "${skills ? skills.join(", ") : 'Not provided'}"
      Certifications: "${certifications ? certifications.join(", ") : 'Not provided'}"
      Projects they listed: "${projects ? JSON.stringify(projects) : 'Not provided'}"

      Create a JSON response conforming EXACTLY to the following TypeScript structure:
      {
        "name": "string (the user's full name, extracted or original)",
        "title": "string (e.g. Senior Full Stack Engineer, Machine Learning Developer)",
        "bio": "string (a high-quality, professional, engaging personal bio of 3-4 sentences in first-person)",
        "skills": ["string", "string", ...],
        "projects": [
          {
            "title": "string",
            "description": "string (a high-quality description starting with an active verb like 'Built', 'Engineered', or 'Designed', highlighting the impact and complexity)",
            "techStack": ["string", "string", ...]
          }
        ],
        "experience": [
          {
            "company": "string",
            "role": "string",
            "duration": "string",
            "description": "string (summarized key accomplishment)"
          }
        ],
        "education": [
          {
            "school": "string",
            "degree": "string",
            "duration": "string"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            bio: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "description", "techStack"],
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["company", "role", "duration", "description"],
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  duration: { type: Type.STRING },
                },
                required: ["school", "degree", "duration"],
              },
            },
          },
          required: ["name", "title", "bio", "skills", "projects", "experience", "education"],
        },
      },
    });

    const parsedResult = JSON.parse(response.text || "{}");

    // Merge generated data into their existing portfolio
    const updatedPortfolio = {
      ...originalPortfolio,
      name: parsedResult.name || originalPortfolio.name,
      title: parsedResult.title || originalPortfolio.title,
      bio: parsedResult.bio || originalPortfolio.bio,
      skills: parsedResult.skills || originalPortfolio.skills,
      projects: (parsedResult.projects || []).map((p: any) => ({
        id: crypto.randomUUID(),
        title: p.title,
        description: p.description,
        techStack: p.techStack,
      })),
      experience: (parsedResult.experience || []).map((exp: any) => ({
        id: crypto.randomUUID(),
        company: exp.company,
        role: exp.role,
        duration: exp.duration,
        description: exp.description,
      })),
      education: (parsedResult.education || []).map((edu: any) => ({
        id: crypto.randomUUID(),
        school: edu.school,
        degree: edu.degree,
        duration: edu.duration,
      })),
    };

    db.portfolios[username] = updatedPortfolio;

    // Refresh project clicks in analytics
    const projectViews = updatedPortfolio.projects.map((p: any) => ({
      projectId: p.id,
      projectTitle: p.title,
      views: Math.floor(Math.random() * 50) + 10,
    }));
    db.analytics[username] = {
      ...db.analytics[username],
      mostViewedProjects: projectViews,
    };

    writeDB(db);

    res.json({ success: true, username, portfolio: updatedPortfolio });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI portfolio. Please check your API key." });
  }
});

// Single API to Fetch Portfolio
app.get("/api/portfolio/:id", (req, res) => {
  const username = req.params.id.toLowerCase();
  const db = readDB();
  const portfolio = db.portfolios[username];

  if (!portfolio) {
    res.status(404).json({ error: "Portfolio not found." });
    return;
  }

  res.json(portfolio);
});

// Save Portfolio Customizations (Theme, Colors, Layouts)
app.post("/api/portfolio/:id/save", (req, res) => {
  const username = req.params.id.toLowerCase();
  const db = readDB();

  if (!db.portfolios[username]) {
    res.status(404).json({ error: "Portfolio not found." });
    return;
  }

  db.portfolios[username] = {
    ...db.portfolios[username],
    ...req.body,
  };

  writeDB(db);
  res.json({ success: true, portfolio: db.portfolios[username] });
});

// Track analytics metrics
app.post("/api/portfolio/:id/track-view", (req, res) => {
  const username = req.params.id.toLowerCase();
  const { eventType, projectId } = req.body;
  const db = readDB();

  if (!db.analytics[username]) {
    db.analytics[username] = {
      totalVisitors: 0,
      avgTimeSpentMin: 0,
      totalQuestions: 0,
      clickThroughRate: 0,
      visitorsOverTime: [],
      mostViewedProjects: [],
    };
  }

  const analytics = db.analytics[username];

  if (eventType === "view") {
    analytics.totalVisitors += 1;
    // Append to today's stats (simulation)
    const today = analytics.visitorsOverTime[analytics.visitorsOverTime.length - 1];
    if (today) {
      today.visitors += 1;
    }
  } else if (eventType === "question") {
    analytics.totalQuestions += 1;
    const today = analytics.visitorsOverTime[analytics.visitorsOverTime.length - 1];
    if (today) {
      today.questionsAsked += 1;
    }
  } else if (eventType === "projectClick" && projectId) {
    const proj = analytics.mostViewedProjects.find((p: any) => p.projectId === projectId);
    if (proj) {
      proj.views += 1;
    } else {
      analytics.mostViewedProjects.push({ projectId, projectTitle: "Project", views: 1 });
    }
    const today = analytics.visitorsOverTime[analytics.visitorsOverTime.length - 1];
    if (today) {
      today.projectClicks += 1;
    }
  }

  writeDB(db);
  res.json({ success: true });
});

// Fetch Analytics Report
app.get("/api/portfolio/:id/analytics", (req, res) => {
  const username = req.params.id.toLowerCase();
  const db = readDB();
  const analytics = db.analytics[username];

  if (!analytics) {
    res.json({
      totalVisitors: 0,
      avgTimeSpentMin: 0,
      totalQuestions: 0,
      clickThroughRate: 0,
      visitorsOverTime: [],
      mostViewedProjects: [],
    });
    return;
  }

  res.json(analytics);
});

// AI Chat Assistant (RAG implementation)
app.post("/api/portfolio/:id/chat", async (req, res) => {
  const username = req.params.id.toLowerCase();
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Messages array is required." });
    return;
  }

  const db = readDB();
  const portfolio = db.portfolios[username];

  if (!portfolio) {
    res.status(404).json({ error: "Portfolio not found." });
    return;
  }

  try {
    const ai = getGemini();

    // Context for RAG: Include candidate's bio, skills, projects, and work experience
    const candidateContext = `
      You are the AI Recruiter Chatbot for ${portfolio.name}. Your job is to answer questions about ${portfolio.name}'s professional background, technical skills, projects, and achievements clearly, confidently, and in an engaging manner.
      
      Candidate Profile:
      - Name: ${portfolio.name}
      - Title: ${portfolio.title}
      - Professional Bio: ${portfolio.bio}
      
      Skills:
      ${portfolio.skills.join(", ")}
      
      Projects:
      ${(portfolio.projects || []).map((p: any) => `- **${p.title}**: ${p.description} (Tech: ${p.techStack.join(", ")})`).join("\n")}
      
      Work Experience:
      ${(portfolio.experience || []).map((exp: any) => `- **${exp.role}** at ${exp.company} (${exp.duration}): ${exp.description}`).join("\n")}
      
      Education:
      ${(portfolio.education || []).map((edu: any) => `- **${edu.degree}** from ${edu.school} (${edu.duration})`).join("\n")}

      Keep your answers helpful, warm, and highly professional. If asked about contact info, provide: ${portfolio.contact.email}.
      If the recruiter asks something not listed in the context, answer politely and suggest they contact the candidate directly at ${portfolio.contact.email} or ask system-related details about how to collaborate.
    `;

    // Map message history to Gemini contents structure
    const promptContents = messages.map((m: any) => {
      return `${m.sender === "user" ? "Recruiter" : "AI Assistant"}: ${m.text}`;
    }).join("\n");

    const fullPrompt = `
      Candidate context:
      ${candidateContext}

      Conversation History:
      ${promptContents}

      Latest Question: ${messages[messages.length - 1].text}
      AI Assistant:
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
    });

    res.json({
      text: response.text || "I apologize, but I couldn't generate an answer right now.",
    });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI chat. Please check your API key." });
  }
});

// GitHub Project Analyzer Route
app.post("/api/github/analyze", async (req, res) => {
  const { repoUrl, prompt } = req.body;

  if (!repoUrl) {
    res.status(400).json({ error: "Repository URL is required." });
    return;
  }

  try {
    const ai = getGemini();
    const systemPrompt = `
      You are an elite Software Architect. Based on the GitHub repository URL, analyze what this project represents, and write a realistic, highly professional architectural review.
      
      Repository URL: "${repoUrl}"
      User's question/prompt: "${prompt || 'Explain this project structure, stack, and design decisions.'}"

      Provide your analysis in clean JSON with the following fields:
      {
        "repoName": "extracted project name",
        "techStack": ["string", "string", ...],
        "architecture": "A concise paragraph summarizing the architectural pattern (e.g. Clean Architecture, MVC, Serverless Microservices) and file organization.",
        "designDecisions": "A key design trade-off or decision made for this stack (e.g., opting for Client-side state vs Server caching).",
        "complexity": "High / Medium / Low with a quick reasoning sentence.",
        "recruiterExplanation": "A plain English summary a non-technical recruiter can understand."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            repoName: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            architecture: { type: Type.STRING },
            designDecisions: { type: Type.STRING },
            complexity: { type: Type.STRING },
            recruiterExplanation: { type: Type.STRING },
          },
          required: ["repoName", "techStack", "architecture", "designDecisions", "complexity", "recruiterExplanation"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("GitHub Analyzer error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze GitHub repository." });
  }
});

// AI Mock Interview API
app.post("/api/interview/start", async (req, res) => {
  const { category, skills } = req.body;

  try {
    const ai = getGemini();
    const prompt = `
      Generate 3 highly realistic technical interview questions for the category "${category || 'dsa'}" and technologies "${skills ? skills.join(", ") : 'Software Engineering'}".
      One question should be easy-medium, one medium, and one challenging.
      
      Provide your response in clean JSON conforming to the following schema:
      [
        {
          "id": "unique-id-1",
          "category": "dsa | system-design | behavioral",
          "question": "The question prompt",
          "hints": ["Hint 1", "Hint 2"]
        },
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              question: { type: Type.STRING },
              hints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "category", "question", "hints"],
          },
        },
      },
    });

    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    console.error("Interview Start error:", error);
    res.status(500).json({ error: error.message || "Failed to start interview questions." });
  }
});

app.post("/api/interview/evaluate", async (req, res) => {
  const { question, userAnswer, category } = req.body;

  if (!question || !userAnswer) {
    res.status(400).json({ error: "Question and User Answer are required." });
    return;
  }

  try {
    const ai = getGemini();
    const prompt = `
      You are an expert interviewer evaluating a candidate's response to an interview question.
      
      Category: "${category}"
      Question: "${question}"
      Candidate's Answer: "${userAnswer}"

      Grade the candidate's answer constructively. Give an ATS-styled score out of 100, identify solid strengths, actionable improvements, and write down an elegant, production-grade sample answer.
      
      Respond in JSON conforming exactly to:
      {
        "score": number (0 to 100),
        "strengths": ["string", "string", ...],
        "improvements": ["string", "string", ...],
        "sampleAnswer": "detailed markdown explaining the model answer"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleAnswer: { type: Type.STRING },
          },
          required: ["score", "strengths", "improvements", "sampleAnswer"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Interview Evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate response." });
  }
});

// Resume Builder / Resume Bullet Optimizer API
app.post("/api/resume/optimize", async (req, res) => {
  const { bulletText, roleTarget } = req.body;

  if (!bulletText) {
    res.status(400).json({ error: "Bullet text is required." });
    return;
  }

  try {
    const ai = getGemini();
    const prompt = `
      You are an expert resume consultant specializing in ATS (Applicant Tracking System) optimization.
      Optimize the following resume bullet point or paragraph for the target role: "${roleTarget || 'Software Engineer'}".
      
      Original Bullet: "${bulletText}"
      
      Rewrite it using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
      Make sure to use strong action verbs, quantify achievements where possible (or simulate realistic metrics based on context), and optimize for ATS.

      Provide a JSON response with:
      {
        "originalText": "the original bullet",
        "optimizedText": "the single best overall optimized bullet point using XYZ format",
        "bulletPoints": ["Alternate ATS rewrite version A", "Alternate ATS rewrite version B"],
        "atsScore": number (calculated increase, e.g. 85),
        "suggestions": ["list of keyword suggestions or advice"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalText: { type: Type.STRING },
            optimizedText: { type: Type.STRING },
            bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            atsScore: { type: Type.INTEGER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["originalText", "optimizedText", "bulletPoints", "atsScore", "suggestions"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Resume Optimization error:", error);
    res.status(500).json({ error: error.message || "Failed to optimize resume." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
