import fs,{stat} from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js";
import { getModel } from "../config/llmModel.js";
import { checkAgentLimit } from "../config/agentLimits.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const pdfRag = async (state) => {
  try {
    await checkAgentLimit(state.userId,"pdf");
    const buffer = fs.readFileSync(state.file.path);

    const pdf = new PDFParse({
      data: buffer,
    });

    const result =await pdf.getText();
    const text = result.text;

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    const docs = await splitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;
    const store= await vectorStore(docs, collectionName);

    const relevantDocs = await store.similaritySearch(state.prompt,4);

    const context = relevantDocs.map(doc=>doc.pageContent).join("\n\n");

    const llm=await getModel("pdfRag");

    const messages = [
  new SystemMessage(`
You are an AI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:

"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.
`),

    new HumanMessage(`
        Context:${context}
        Question:${state.prompt}
    `)
];

    const response = await llm.invoke(messages);
    
    return {
      ...state,
      aiResponse: response.content,
    };

  } catch (error) {
    console.log(error);
        return{
            ...state,
            aiResponse:error?.data?.message || "Failed to analyze the PDF."
        }

  }
  finally{
    fs.unlinkSync(state.file.path)
  }
};