import { useEffect, useState } from "react";

export default function useRecipientStatus(recipientId, socket) {
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);

  useEffect(() => {
    if (!recipientId || !socket) return;

    // Emit event to check recipient's status
    socket.emit("check-recipient-status", recipientId);

    // Handle recipient status response from server
    const handleRecipientStatus = ({ recipientId: id, isOnline }) => {
      if (id === recipientId) {
        setIsRecipientOnline(isOnline);
      }
    };

    // Handle user-online event from server
    const handleUserOnline = ({ userId }) => {
      if (userId === recipientId) {
        setIsRecipientOnline(true);
      }
    };

    // Handle user-offline event from server
    const handleUserOffline = ({ userId }) => {
      if (userId === recipientId) {
        setIsRecipientOnline(false);
      }
    };

    // Listen for events
    socket.on("recipient-status", handleRecipientStatus);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    // Cleanup listeners on component unmount
    return () => {
      socket.off("recipient-status", handleRecipientStatus);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, [recipientId, socket]);

  return isRecipientOnline;
}
