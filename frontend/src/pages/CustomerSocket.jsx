import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const SOCKET_URL = "https://localwala-1.onrender.com";

function CustomerSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));

    // Don't connect if not logged in
    if (!customer?._id) return;

    // Create socket INSIDE effect (not at module level)
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", customer._id); // Join after confirmed connection
    });

    socket.on("orderUpdate", (data) => {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 4000,
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    return () => {
      // Remove listeners first, then disconnect
      socket.off("orderUpdate");
      socket.off("connect");
      socket.disconnect();
    };
  }, []); // Runs once on mount

  return null;
}

export default CustomerSocket;