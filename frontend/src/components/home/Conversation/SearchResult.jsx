import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import UserSearchResult from "./UserSearchResult";

export default function SearchResult({ searchResult }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full  overflow-y-scroll custom-scrollbar flex justify-center items-center">
        <CircularProgress
          style={{ color: "#ff5722" }}
          data-testid="loading-spinner"
        />
      </div>
    );
  }
  return (
    <div className="w-full h-full  overflow-y-scroll custom-scrollbar">
      {/*Contact header */}
      <div className="flex flex-col px-4 ">
        <h1 className="font-extralight text-md text-[#CC461B]">CONTACTS</h1>
        <span className="w-full mt-4 border-[#202C33] ml-[50px] border-b"></span>
      </div>
      {searchResult &&
        searchResult.map((user) => (
          <UserSearchResult newContact={user} key={user._id} />
        ))}
    </div>
  );
}
