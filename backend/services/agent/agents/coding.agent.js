import { checkAgentLimit } from "../config/agentLimits.js";
import { getModel } from "../config/llmModel.js";

export const codingAgent =async(state)=>{
    try{
        await checkAgentLimit(state.userId,"coding");
    const intentllm=await getModel("intent");
    const llm=await getModel("coding")
    const intentRes=await intentllm.invoke(`
        You are an intent classifier.

        Return ONLY one of these values.

        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION

        User Request:
        ${state.prompt}
    `)
    const intent=intentRes.content.trim()
    if(intent=="CODE_GENERATION"){
        const prompt=`You are an AI Coding Agent.

    Generate the requested project.

    Default stack:
    - HTML
    - CSS
    - JavaScript

    Use React / Next.js / Vue ONLY if explicitly requested.

    Rules:

    - Responsive
    - Modern UI
    - CSS Variables
    - Flexbox/Grid
    - Smooth Scroll
    - Hover Effects
    - Beautiful spacing
    - Single page unless user asks otherwise.
    Return ONLY valid JSON.

    IMAGES
    ===================
    Always use Unsplash API for images.
    Never use placeholders.
    Return only valid JSON.

    Schema:

    {
    "files": [
        {
        "name": "index.html",
        "content": "..."
        },
        {
        "name": "style.css",
        "content": "..."
        },
        {
        "name": "script.js",
        "content": "..."
        }
    ]
    }
    Rules:
    -Output must start with {
    -Output must end with }
    -No markdown
    -No explanation
    -No extra text
    -No \`\`\`
    -Never mention intent

    User Request:
    ${state.prompt}

    `
        const res=await llm.invoke(prompt);
        console.log(res);
        let text = res.content.trim();

        text = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

        const data = JSON.parse(text);

        return {
            ...state,
            aiResponse:"Code generated Successfully.",
            artifacts:[
                {
                    id:Date.now(),
                    type:"Project",
                    files:data.files || [],
                    title:state.prompt
                }
            ]
        }
    }

    const res=await llm.invoke(`
        ${intent}

        Return Markdown only.

        Never generate project files.

        Use headings like:

        # Overview

        ## Explanation

        ## Problems

        ## Improvements

        ## Best Practices

        ## Optimized Code (if needed)

        User Request:
        ${state.prompt}
    `)
    const data=res.content
    return {
        ...state,
        aiResponse:data,
        artifacts:[]
    }
    }
    catch(error){
        console.log(error);
        return{
            ...state,
            artifacts:[],
            aiResponse:error?.data?.message || "Failed to generate code."
        }
    }
    
}