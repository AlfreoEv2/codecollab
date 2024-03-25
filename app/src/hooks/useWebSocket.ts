import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FileOrFolder } from "../interfaces/SidebarInterface";

type WebSocketMessage = {
  type: string;
  lines?: string[];
  files?: FileOrFolder[];
};

export default function useWebSocket(
  url: string,
  onMessage: (data: WebSocketMessage) => void
) {
  // Get the session ID from the URL
  const { uuid: session } = useParams();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
      // Join the session
      ws.current?.send(JSON.stringify({ type: "join", session }));
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    ws.current.onmessage = (message) => {
      onMessage(JSON.parse(message.data));
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, onMessage]);

  const send = (data: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ ...data, session }));
    }
  };

  return { send };
}
