import React, { useRef, useState } from 'react'
import { Paperclip, Mic, Send ,Zap,MessageSquare,Code2, FileText, Presentation, ImageIcon, Globe, X} from 'lucide-react'
import { useSelector,useDispatch } from 'react-redux'
import sendMessage from '../features/sendMessage'
import { addMessage,setArtifacts,setIsLoading } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { setSelectedConversation } from '../redux/conversationSlice'
import { addConversation } from '../redux/conversationSlice'
import { setConvTitle } from '../redux/conversationSlice'
import {updateConversation} from '../features/updateConversation'



function ChatInput() {

    const [value,setValue]=useState("");
    const [selectedAgent,setSelectedAgent]=useState("Auto");
    const {selectedConversation}=useSelector((state)=>state.conversation)
    const {messages,isLoading}=useSelector((state)=>state.message)
    const [selectedFile,setSelectedFile]=useState(null);
    const fileRef=useRef(null);

    const dispatch=useDispatch();
    const handleSendMessage=async()=>{
      dispatch(setIsLoading(true));
      let conversation=selectedConversation;
      if(!conversation){
        const conv=await createConversation();
        dispatch(setSelectedConversation(conv));
        dispatch(addConversation(conv));
        conversation=conv;
      }

      if(conversation.title==="New Chat"){
         await updateConversation({id:conversation._id,title:value.trim()});
         dispatch(setConvTitle({conversationId:conversation._id,title:value.trim()}))
      }

       const formData=new FormData();
        formData.append("prompt",value.trim());
        formData.append("conversationId",conversation?._id);
        formData.append("agent",selectedAgent.toLowerCase());
        if(selectedFile){
          formData.append("file",selectedFile);
        }
        

       dispatch(addMessage({role:"user",content:value.trim()}))

       setValue("");

       const data=await sendMessage(formData)
       dispatch(setIsLoading(false));
       setSelectedFile(null);
       dispatch(setArtifacts(data?.artifacts || []))
       dispatch(addMessage({role:"assistant",content:data?.answer,images:data?.images}))
    }

    const agents=[
      {
        id:"auto",
        icon:Zap,
        label:"Auto"
      },
      {
        id:"chat",
        icon:MessageSquare,
        label:"Chat"
      },
      {
        id:"coding",
        icon:Code2,
        label:"Coding"
      },
      {
        id:"pdf",
        icon:FileText,
        label:"Pdf"
      },
      {
        id:"ppt",
        icon:Presentation,
        label:"PPT"
      },
      {
        id:"imagegen",
        icon:ImageIcon,
        label:"imagegen"
      },
      {
        id:"search",
        icon:Globe,
        label:"Search"
      }
    ]


  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
        <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
          
          <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
              {
                agents.map((agent)=>{
                  const isSelected=selectedAgent===agent.label;
                  const Icon=agent.icon
                  return(
                    <div onClick={()=>setSelectedAgent(agent.label)} className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2
                    rounded-full text-xs font-medium border transition-all cursor-pointer
                    ${
                      isSelected
                        ?"bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                        :"bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                    }`}>
                      <Icon size={14} className={isSelected ? "text-white" : "text-slate-400"}/>
                      {agent.label}

                    </div>
                  )
                })}
          </div>

          {
            selectedFile && (
              <div className="my-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                  {
                    selectedFile?.type === "application/pdf" ? (
                      <FileText size={16} className="text-red-400"/>
                    ) : (
                      selectedFile.type.startsWith("image/") && (
                        <img src={URL.createObjectURL(selectedFile)} className="h-10 w-10 rounded-xl object-cover mt-3"/>
                      )
                    )
                  }

                  <div>
                  <p className="text-sm text-white mt-1">
                    {selectedFile?.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {selectedFile?.size && (selectedFile.size/1024/1024).toFixed(2)} MB
                  </p>
                  
                </div>
                <button onClick={()=>{setSelectedFile(null);fileRef.current.value =""}} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={14}/>
                </button>
                </div>

                
              </div>
            )
          }

          <textarea
            placeholder="Ask Anything..."
            onChange={(e)=>setValue(e.target.value)}
            value={value}
            className="w-full bg-transparent outline-none resize-none text-[14px]
            text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
            rows={3}/>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* <input type="file" ref={fileRef} accept=".pdf,image/*" className="hidden" onChange={(e)=>setSelectedFile(e.target.files[0])}/> */}
              <input
                type="file"
                ref={fileRef}
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

                  if (file.size > MAX_SIZE) {
                    alert("File size exceeds 10 MB. Please upload a smaller file.");
                    e.target.value = "";
                    setSelectedFile(null);
                    return;
                  }

                  setSelectedFile(file);
                }}
              />
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600
                hover:text-slate-400 hover:bg-white/[0.05] border border-transparent
                hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer " 
                onClick={()=>fileRef.current.click()}>
                <Paperclip size={16} />
              </button>

              {/* <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600
                hover:text-slate-400 hover:bg-white/[0.05] border border-transparent
                hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
                <Mic size={16} />
              </button > */}
            </div>
            <button 
            onClick={handleSendMessage}
            disabled={!value && isLoading}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer
             transition-all duration-150 ${value.trim() ?"bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
              :"bg-white/[0.05] text-slate-600 cursor-not-allowed</div>"}`}>
              <Send size={15}/>
            </button>
          </div>

        </div>
    </div>
  )
}

export default ChatInput
