import AttachementPicker from "./actions/AttachementPicker";
import MessageInput from "./actions/MessageInput";
import VoiceRecorder from "./actions/VoiceRecorder";

export default function ChatActions() {
  return (
    <div className="w-full h-full flex">
      {/*Attachement Picker*/}

      <AttachementPicker />
      <MessageInput />
      <VoiceRecorder />
    </div>
  );
}
