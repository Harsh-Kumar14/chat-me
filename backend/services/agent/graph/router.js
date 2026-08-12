import { getModel } from "../config/llmModel.js"

export const router = async (state) => {

    if(state.agent && state.agent!=="auto"){
        return {
            ...state,
            agent:state.agent
        }
    }
    if(state.file?.mimetype==="application/pdf"){
        return {
            ...state,
            agent:"pdfRag"
        }
    }
    if(state.file?.mimetype.startsWith("image/")){
        return {
            ...state,
            agent:"imageAnalyzer"
        }
    }

    const llm=await getModel("router");

    const prompt=`you are and agent router.
    
    Available agents:
    -chats
    -search
    -coding
    -pdf
    -ppt
    -imageGen

    Rules:

    chat:
    General conversation,explanation,learning,questions.

    search:
    current events,latest information,news,recent developments,internet lookup.

    coding:
    Generate code,debug code,build projects,architecture,API design.

    pdf:
    Questions about generate pdf or Document context.

    ppt:
    Questions about generate ppts or ppt context.

    imageGen:
    Generate image,create image.

    Return only one word:

    chat,ppt,coding,pdf,imageGen,search

    user Query:${state.prompt}`

    const response=await llm.invoke(prompt);

    return {
        ...state,
        agent:response.content.trim().toLowerCase()
    }

}