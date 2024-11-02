"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export function useCustomerSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      path: "/api/socketio",
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket };
}