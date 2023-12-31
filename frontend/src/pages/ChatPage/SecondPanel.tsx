import {MessageSquare, Pause, Play} from "lucide-react";
import {ChatsComp} from "@/pages/ChatPage/ChatsComp.tsx";
import React, {useCallback, useContext} from "react";
import {Video} from "lucide-react"
import {VideoComp} from "@/pages/ChatPage/VideoComp.tsx";
import {StreamContext} from "@/pages/ChatPage/StreamContextComp.tsx";
import {toast} from "sonner";
import SpeechRecognition from "react-speech-recognition";

export const SecondPanel=({setFirstPanel,firstPanel,setMic,chats,setChats}:{setFirstPanel: React.Dispatch<React.SetStateAction<string>>,firstPanel:string,setMic: React.Dispatch<React.SetStateAction<boolean>>,chats:{from: string, message: string}[],setChats:React.Dispatch<React.SetStateAction<{from: string, message: string}[]>>})=>{
    const {stream,setStream}=useContext(StreamContext) as {stream:MediaStream|null,setStream:React.Dispatch<React.SetStateAction<MediaStream | null>>};
    const playPauseVideo=useCallback(async ()=>{
        if(stream){
            try{
                stream.getVideoTracks().forEach((track) => track.stop());
                setStream(null);
            }catch (e){
                console.log("error in turning video off")
            }
        }
        else{
            try{
                const stream= await navigator.mediaDevices.getUserMedia({
                    video:true,audio:false
                });
                setStream(stream);
            }
            catch (e) {
                console.log(e)
                toast("Camera device not found", {
                    description:"Make sure to give camera permission to Browser",
                    action: {
                        label: "Close",
                        onClick: () => console.log("close"),
                    },
                })
            }
        }


    },[setStream, stream])
    return <div className={"flex items-center gap-4 h-[250px] w-full max-xl:flex-col max-xl:h-fit"}>
            <div className={"flex-grow h-full bg-transparent backdrop-blur-md rounded-[40px] flex items-center justify-between gap-2 max-xl:w-full max-xl:h-[250px] pl-8 "}>
                {firstPanel==="Video"?<ChatsComp chats={chats} />:<VideoComp/>}

                <div className={"min-w-[200px] max-w-[200px] max-md:min-w-20 max-md:max-w-20  h-full flex justify-center items-center flex-col gap-4"} >
                    <div className={"bg-[#2867ad] rounded-full w-1/3 max-md:w-2/3 aspect-square flex justify-center items-center  shadow-[0_0_2px_15px_#61525c] "} onClick={()=>{
                        setFirstPanel(firstPanel==='Video'?"Chat":"Video")
                        setMic(false)
                        SpeechRecognition.abortListening().then(()=>{
                            console.log("listening closed")
                        })

                    }}>
                        {firstPanel==="Video"?<MessageSquare fill={"white"} color={"white"} size={30}/>:
                            <Video fill={"white"} color={"white"} size={30}/>
                        }
                    </div>
                    <div className={"text-white font-bold"}>{firstPanel==="Video"?"Chat":"Video"}</div>
                </div>
            </div>
            <div className={"min-w-[200px] max-w-[200px]  h-full bg-transparent backdrop-blur-md rounded-[40px] flex flex-col justify-center items-center gap-4 max-xl:w-full max-xl:h-[150px]"}>
                <div onClick={playPauseVideo} className={"bg-[#2867ad] w-1/3 rounded-full aspect-square flex justify-center items-center  shadow-[0_0_2px_15px_#61525c] max-xl:w-[60px] "}>
                    {stream!=null?<Pause color={"white"} size={30}/>:<Play color={"white"} size={30}/>}
                </div>
                <div className={"text-white font-bold"} >{stream!=null?"Pause Video":"Play Video"}</div>

            </div>
        </div>

}