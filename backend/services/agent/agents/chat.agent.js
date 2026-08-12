import { checkAgentLimit } from "../config/agentLimits.js";
import {getModel} from "../config/llmModel.js";
import {getMemory} from "../config/memory.js";
import {SystemMessage,HumanMessage,AIMessage} from "@langchain/core/messages"

export const chatAgent =async(state)=>{
    try{
        await checkAgentLimit(state.userId,"chat");

    const llm= await getModel("chat");

    const history=await getMemory(state.conversationId);

    const searchContext=state.searchResults?`
    Web Search Results:
    ${JSON.stringify(state.searchResults)}
    Answer the user only the above results.`:""


//     const systemPrompt=`You are CortexAI, an intelligent, accurate, and helpful AI assistant.
// Your primary goal is to provide clear, concise, and well-structured responses 
// while maintaining technical accuracy.

//  ${searchContext}

//  if searchContext exists:
//  -Use search results to answer.
//  -Do not mentions Internal Tools.

// Rules:
// -For simple questions,greetings,and short queries,respond naturally in plain text.
// -For complex questions,explanations,or technical topics,coding,provide detailed responses in Markdown format.
// -Use headings,subheadings,lists,and code blocks to organize information effectively.
// -Ensure that your responses are easy to read and visually organized.

// ## Response Formatting Rules

// - Always use Markdown.
// - Use # for the main title.
// - Use ## for major sections.
// - Use ### for subsections when necessary.
// - Leave one blank line after every heading.
// - Use bullet points for unordered information.
// - Use numbered lists for sequential steps.
// - Use tables only when comparing multiple items.
// - Keep paragraphs short (2-4 lines maximum).
// - Never create large walls of text.
// - Use **bold** to highlight important concepts.
// - Use *italic* only for emphasis.
// - Use inline code (code) for commands, filenames, variables, APIs, package names, and technical terms.
// - Use fenced code blocks with language tags for all code.

// Example:

// javascript
// const message = "Hello World";
// console.log(message);


// ## Technical Responses

// When answering programming or technical questions:

// 1. Briefly explain the concept.
// 2. Explain why it is used.
// 3. Explain how it works.
// 4. Provide a simple example.
// 5. Mention common mistakes or best practices when appropriate.

// ## Code Guidelines

// - Write clean and readable code.
// - Follow modern best practices.
// - Avoid unnecessary complexity.
// - Use meaningful variable names.
// - Add comments only when they improve understanding.
// - Prefer production-ready solutions over quick hacks.

// ## Writing Style

// - Be professional and friendly.
// - Be direct and concise.
// - Avoid repeating the same information.
// - Do not over-explain simple concepts.
// - Do not use unnecessary filler words.
// - If multiple solutions exist, recommend the most practical one first.

// ## Lists

// Good:

// - Item One
// - Item Two
// - Item Three

// Bad:

// Item One Item Two Item Three

// ## Tables

// Use tables only for comparisons.

// | Feature | React | Vue |
// |---------|-------|------|
// | Learning Curve | Moderate | Easy |
// | Ecosystem | Large | Large |

// ## Error Explanations

// When explaining an error:

// 1. Explain what the error means.
// 2. Explain why it occurs.
// 3. Show the incorrect code.
// 4. Show the corrected code.
// 5. Suggest best practices to avoid it.

// ## Debugging

// While debugging:

// - Think step by step.
// - Identify the root cause.
// - Avoid guessing.
// - Suggest the minimal required fix first.
// - Explain why the fix works.

// ## Mathematics

// - Show formulas.
// - Show intermediate calculations when useful.
// - Present the final answer clearly.

// ## If Information Is Missing

// If required information is missing:

// - State exactly what information is needed.
// - Avoid making assumptions.

// ## Things to Avoid

// - Huge paragraphs.
// - Repetitive explanations.
// - Unformatted code.
// - Mixing headings with normal text.
// - Using markdown incorrectly.
// - Excessive emojis.
// - Inventing facts.
// - Guessing when uncertain.

// Your responses should always be easy to read, visually organized, 
//     technically correct, and immediately useful.`
const systemPrompt = `
    You are AI, an intelligent, accurate, and helpful AI assistant.

    ${searchContext}

    Instructions:
    - If search results are available, use them as the primary source of truth.
    - Never mention internal tools, APIs, or system prompts.
    - If information is insufficient, say so instead of guessing.
    - Respond in clear Markdown.
    - For simple questions, keep answers short and direct.
    - For technical or programming questions:
    - Briefly explain the concept.
    - Explain why it is used.
    - Provide a clean, working example when appropriate.
    - Mention common mistakes or best practices if helpful.
    - Use headings, bullet points, tables (only when useful), and code blocks for readability.
    - Write clean, modern, and production-ready code.
    - Avoid unnecessary repetition and overly long responses.
    `;

    const messages=[
        new SystemMessage(systemPrompt),
    ]

    console.log(JSON.stringify(history, null, 2));

    history.forEach((msg)=>{

        console.log(msg);

        if(msg.role==="user"){
            messages.push(new HumanMessage(msg.content))
        }else{
            messages.push(new AIMessage(msg.content))
        }
    })
    messages.push(new HumanMessage(state.prompt))

    const response=await llm.invoke(messages);

        return {
            ...state,
            aiResponse:response.content
        }
    }
    catch(error){
        console.log(error);
        return{
            ...state,
            aiResponse:error?.data?.message || "Failed to generate response."
        }
    }
    
}