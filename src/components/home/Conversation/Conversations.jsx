import { DotsIcon } from "../../svg";
import ConversationList from "./ConversationList";
import SearchBar from "./SearchBar";
export default function Conversations() {
  return (
    <div className="w-full h-full bg-dark_bg_8 flex flex-col">
      {/* Header */}
      <div className=" flex justify-between items-center text-white  p-2">
        <h1 className="text-lg">Chats</h1>
        <ul className="flex items-center justify-center">
          <li>
            <DotsIcon className="fill-white" />
          </li>
        </ul>
      </div>
      {/*Search bar */}
      <SearchBar />
      {/* Conversation list*/}
      <ConversationList />
    </div>
  );
}
