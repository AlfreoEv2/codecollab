import { useEffect, useRef } from "react";
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
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
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
      ws.current.send(JSON.stringify(data));
    }
  };

  return { send };
}
