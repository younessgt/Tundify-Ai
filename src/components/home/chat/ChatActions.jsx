import { useState } from "react";
import AttachementPicker from "./actions/AttachementPicker";
import MessageInput from "./actions/MessageInput";
import VoiceRecorder from "./actions/VoiceRecorder";

export default function ChatActions({ beginRecording, setBeginRecording }) {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full h-full flex">
      {/* Attachement Picker

      <AttachementPicker />
      <MessageInput message={message} setMessage={setMessage} />
      <VoiceRecorder /> */}

      {beginRecording ? (
        <VoiceRecorder
          setBeginRecording={setBeginRecording}
          beginRecording={beginRecording}
        />
      ) : (
        <>
          <AttachementPicker />
          <MessageInput message={message} setMessage={setMessage} />
          <VoiceRecorder
            setBeginRecording={setBeginRecording}
            beginRecording={beginRecording}
          />
        </>
      )}
    </div>
  );
}
