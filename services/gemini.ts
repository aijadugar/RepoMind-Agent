import { GoogleGenAI, Type } from "@google/genai";
import { RepoAnalysis } from "../types";

// Ensure API Key is available
const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey });
async function checkGitHubRepoExists(repoUrl: string): Promise<void> {
  try {
    const parsed = new URL(repoUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);

    if (parts.length < 2) {
      throw new Error('Invalid GitHub repository URL');
    }

    const owner = parts[0];
    const repo = parts[1].replace('.git', '');

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
      },
    });

    if (response.status === 404) {
      throw new Error('Repository not found on GitHub');
    }

    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded or private repository');
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
  } catch (err: any) {
    throw new Error(err.message || 'Failed to verify repository existence');
  }
}

export const analyzeRepository = async (
  repoUrl: string
): Promise<RepoAnalysis> => {
  await checkGitHubRepoExists(repoUrl);
  const model = "gemini-3-flash-preview"; // use Pro for reasoning credibility

  const prompt = `
You are RepoMind Agent, an autonomous repository intelligence system.

You MUST follow this workflow and explicitly show each step:

PLAN
→ [TOOL:INGEST_REPO]
→ [TOOL:ANALYZE]
→ [TOOL:GENERATE_ARTIFACTS]
→ [TOOL:SELF_VERIFY]
→ FINAL OUTPUT

You are NOT allowed to claim direct file access.
If repository contents are not directly accessible, you must:
- Infer architecture using public knowledge and standard engineering patterns
- Clearly reason about assumptions
- Prefer correctness over confidence

────────────────────────────
[TOOL:INGEST_REPO]
Input: ${repoUrl}
Output:
- File tree (inferred or known)
- Key modules
- Programming languages

────────────────────────────
[TOOL:ANALYZE]
Input: Repository structure
Output:
- Overall architecture
- Module responsibilities
- Data flow

────────────────────────────
[TOOL:GENERATE_ARTIFACTS]
Input: Analysis
Output:
- Architecture overview
- Onboarding guide
- Risks & anti-patterns

────────────────────────────
[TOOL:SELF_VERIFY]
Input: Draft output
Output:
- Verified output
- Confidence level

────────────────────────────
FINAL OUTPUT FORMAT (STRICT JSON ONLY):

{
  "architecture_overview": "string",
  "languages": ["string"],
  "file_tree": ["string"],
  "key_modules": [
    {
      "name": "string",
      "responsibility": "string"
    }
  ],
  "risks_and_antipatterns": [
    {
      "title": "string",
      "description": "string",
      "severity": "Low | Medium | High | Critical"
    }
  ],
  "onboarding_guide": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "confidence_level": "High | Medium | Low"
}

Do NOT include markdown.
Do NOT include explanations outside JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            architecture_overview: { type: Type.STRING },
            languages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            file_tree: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            key_modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  responsibility: { type: Type.STRING },
                },
                required: ["name", "responsibility"],
              },
            },
            risks_and_antipatterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: {
                    type: Type.STRING,
                    enum: ["Low", "Medium", "High", "Critical"],
                  },
                },
                required: ["title", "description", "severity"],
              },
            },
            onboarding_guide: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            confidence_level: {
              type: Type.STRING,
              enum: ["Low", "Medium", "High"],
            },
          },
          required: [
            "architecture_overview",
            "languages",
            "file_tree",
            "key_modules",
            "risks_and_antipatterns",
            "onboarding_guide",
            "confidence_level",
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(response.text) as RepoAnalysis;
  } catch (error) {
    console.error("RepoMind analysis failed:", error);
    throw error;
  }
};