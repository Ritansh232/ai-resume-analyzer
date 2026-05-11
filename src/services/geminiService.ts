import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ResumeData {
  name: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    links: string[];
  };
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  aiInsights: {
    strengths: string[];
    suggestedRoles: string[];
    improvementTips: string[];
  };
  nlpInsights: {
    keyPhrases: string[];
    sentiment: string;
    readabilityScore: string;
    tone: string;
    entities: {
      category: string;
      value: string;
    }[];
    keywordDensity: {
      keyword: string;
      count: number;
    }[];
  };
  jobMatch?: {
    score: number;
    analysis: string;
    missingSkills: string[];
  };
}

export async function analyzeResume(input: { text?: string; fileData?: { data: string; mimeType: string }; jobDescription?: string }): Promise<ResumeData> {
  const { text, fileData, jobDescription } = input;
  
  const prompt = jobDescription 
    ? `Analyze the provided resume and compare it with the following job description.
       Extract key information and provide a match analysis in the specified JSON format.
       Also perform deep NLP analysis:
       1. Identify key phrases.
       2. Detect sentiment and tone.
       3. Extract semantic entities (Technologies, Soft Skills, Tools, Certifications).
       4. Calculate top keyword density.
       
       Job Description:
       ${jobDescription}
       `
    : `Analyze the provided resume and extract key information in the specified JSON format.
       Be thorough and professional. If information is missing, use empty strings or arrays.
       Also perform deep NLP analysis:
       1. Identify key phrases.
       2. Detect sentiment and tone.
       3. Extract semantic entities (Technologies, Soft Skills, Tools, Certifications).
       4. Calculate top keyword density.
       `;

  const parts: any[] = [{ text: prompt }];
  
  if (fileData) {
    parts.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType
      }
    });
  } else if (text) {
    parts.push({
      text: `Resume Text:\n${text}`
    });
  } else {
    throw new Error("Either resume text or file data must be provided");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          contact: {
            type: Type.OBJECT,
            properties: {
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              links: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["email", "phone", "location", "links"]
          },
          summary: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                duration: { type: Type.STRING },
                description: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "company", "duration", "description"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                school: { type: Type.STRING },
                year: { type: Type.STRING }
              },
              required: ["degree", "school", "year"]
            }
          },
          aiInsights: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvementTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "suggestedRoles", "improvementTips"]
          },
          nlpInsights: {
            type: Type.OBJECT,
            properties: {
              keyPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
              sentiment: { type: Type.STRING },
              readabilityScore: { type: Type.STRING },
              tone: { type: Type.STRING },
              entities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ["category", "value"]
                }
              },
              keywordDensity: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyword: { type: Type.STRING },
                    count: { type: Type.NUMBER }
                  },
                  required: ["keyword", "count"]
                }
              }
            },
            required: ["keyPhrases", "sentiment", "readabilityScore", "tone", "entities", "keywordDensity"]
          },
          jobMatch: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              analysis: { type: Type.STRING },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "analysis", "missingSkills"]
          }
        },
        required: ["name", "contact", "summary", "skills", "experience", "education", "aiInsights", "nlpInsights"]
      }
    }
  });

  const content = response.text;
  if (!content) throw new Error("No response from AI");
  
  return JSON.parse(content) as ResumeData;
}
