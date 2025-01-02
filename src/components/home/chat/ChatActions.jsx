import { useState } from "react";
import AttachementPicker from "./actions/AttachementPicker";
import MessageInput from "./actions/MessageInput";
import VoiceRecorder from "./actions/VoiceRecorder";

export default function ChatActions() {
  const [message, setMessage] = useState("");
  return (
    <div className="w-full h-full flex">
      {/*Attachement Picker*/}

      <AttachementPicker />
      <MessageInput message={message} setMessage={setMessage} />
      <VoiceRecorder />
    </div>
  );
}
