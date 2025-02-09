import { useDispatch, useSelector } from "react-redux";
import { createOpenConversation } from "@/features/chatSlice";

export default function UserSearchResult({ newContact }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);

  const openConversation = () => {
    // console.log("createConversation");
    const values = {
      accesstoken: user.accessToken,
      recieverId: newContact._id,
      isGroup: false,
    };
    dispatch(createOpenConversation(values));
  };
  return (
    <>
      <div
        className="h-[72px] hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px]"
        onClick={openConversation}
      >
        <div className="relative w-full flex items-center justify-between py-[10px]">
          {/*Left side*/}

          <div className="flex items-center gap-x-3">
            {/*User picture*/}

            <div className="relative max-w-[50px] min-w-[50px] h-[50px] rounded-full overflow-hidden  ">
              <img
                src={newContact?.picture}
                alt="user-picture"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/*User name and message*/}

            <div className="w-full flex flex-col justify-center">
              {/*Conversation name*/}
              <h1 className="font-bold flex items-center">
                {newContact?.name}
              </h1>

              {/*New Contact Message*/}

              <div>
                <div className="flex items-center gap-x-1 dark:text-dark_text_2 ">
                  <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2 ">
                    {newContact?.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Right side*/}
          {/* <div className="dark:text-dark_text_2 text-sm">
            <span>{dateConverter(convo?.latestMessage?.createdAt)}</span>
          </div> */}
        </div>
      </div>
      <div className="border-b-[1px] border-[#202C33] ml-[65px]"></div>
    </>
  );
}
