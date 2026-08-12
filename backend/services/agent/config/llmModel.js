import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
})


const gemini= new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    maxRetries: 2,
})

const openrouter= new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature:0,
    maxTokens:3000
})

export const getModel=async(agent)=>{
    switch(agent){
        case "chat":
            return groq;
        case "search":
            return groq;
        case "coding":
            return openrouter;
        case "imageAnalyzer":
            return gemini;
        default:
            return groq;
    }
}


