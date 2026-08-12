import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js";
import Message from "../../chat/models/message.model.js";

export const agent=async(req,res,next)=>{
    try{
        const {prompt, conversationId,agent}=req.body
        const file=req.file;
        const userId=req.headers["x-user-id"];   // set upstream (gateway / server)

        const result=await graph.invoke({
            prompt,conversationId,agent,file,userId
        })
        const response=result.aiResponse;

        await addMessage(conversationId, "user", prompt);

        await addMessage(conversationId, "assistant", response);

        // Persist both messages to MongoDB directly (previously an HTTP call to
        // the chat service — now a plain DB write since it's the same process).
        await Message.create({
            conversationId,
            role: "user",
            content: prompt,
        });
        await Message.create({
            conversationId,
            role: "assistant",
            content: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts,
        });
        return res.status(200).json({
            answer:result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts
        })
    }
    catch (error) {
        next(error);
    }
}



