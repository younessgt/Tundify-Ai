"use client";
import { updateMessages } from "@/features/chatSlice";
import { createContext, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  // useRef to hold the socket instance; persists across renders without causing re-renders
  const socketRef = useRef();
  const dispatch = useDispatch();

  // State to track connection status
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useSelector((state) => state.userState);

  useEffect(() => {
    // Initialize the Socket.IO connection
    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND, {
      withCredentials: true,
    });

    // Event listener for successful connection
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("socket connected");
    });

    // Emit a "user-join-app" event to the server when a user connects
    socketRef.current.emit("user-join-app", user._id);

    socketRef.current.on("recieve-message", (message) => {
      dispatch(updateMessages(message));
    });
    // Event listener for disconnection
    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("socket disconnected");
    });

    // Cleanup function to run when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected on cleanup");
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
