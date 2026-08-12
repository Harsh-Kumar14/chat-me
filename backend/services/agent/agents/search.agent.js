import { checkAgentLimit } from "../config/agentLimits.js";
import {searchTool} from "../config/tavily.js";

export const searchAgent =async(state)=>{
    try{
        await checkAgentLimit(state.userId,"search");
        const results=await searchTool.invoke({query:state.prompt});
        console.log(JSON.stringify(results, null, 2));
        return {
            ...state,
            searchResults:results,
            images:results.images
        }
    }
    catch(error){
        console.error("Search Agent Error:", error);
        return {
            ...state,
            searchResults:[],
            images:[],
            aiResponse:error?.data?.message || "Failed to perform search."
        }
    }
}