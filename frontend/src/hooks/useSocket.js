"use client";

import { useContext } from "react";
import { SocketContext } from "@/contexts/SocketContext";

export default function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }

  return context;
}
