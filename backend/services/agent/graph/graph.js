import { StateGraph } from "@langchain/langgraph";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { pdfAgent } from "../agents/pdf.agents.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { imageGenAgent } from "../agents/imageGen.agent.js";
import { pdfRag } from "../agents/pdfRag.agent.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agent.js";
import { agentState } from "./state.js";


const workflow= new StateGraph(agentState)

workflow.addNode("router",router);
workflow.addNode("chat",chatAgent);
workflow.addNode("search",searchAgent);
workflow.addNode("pdf",pdfAgent);
workflow.addNode("ppt",pptAgent);
workflow.addNode("coding",codingAgent);
workflow.addNode("imagegen",imageGenAgent);
workflow.addNode("pdfRag",pdfRag);
workflow.addNode("imageAnalyzer",imageAnalyzer);

workflow.addEdge("__start__","router");
workflow.addConditionalEdges("router",(state)=>{
    switch (state.agent) {
        case "chat":
            return "chat";
        case "search":
            return "search";
        case "ppt":
            return "ppt";
        case "pdf":
            return "pdf";
        case "coding":
            return "coding";
        case "imagegen":
            return "imagegen";
        case "pdfRag":
            return "pdfRag";
        case "imageAnalyzer":
            return "imageAnalyzer";
        default:
            return "chat";
    }
},{
    chat:"chat",
    search:"search",
    ppt:"ppt",
    pdf:"pdf",
    coding:"coding",
    imagegen:"imagegen",
    pdfRag:"pdfRag",
    imageAnalyzer:"imageAnalyzer"
})

workflow.addEdge("search", "chat")
workflow.addEdge("chat", "__end__")
workflow.addEdge("coding", "__end__")
workflow.addEdge("pdf", "__end__")
workflow.addEdge("ppt", "__end__")
workflow.addEdge("imagegen", "__end__")
workflow.addEdge("pdfRag", "__end__")
workflow.addEdge("imageAnalyzer", "__end__")

export const graph = workflow.compile()
