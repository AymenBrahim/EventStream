/* import { useEffect, useRef, useState } from "react";

type useWebsocketProps<T> = {
  onMessage: (e: MessageEvent<T>) => any;
  path: string;
};

export default function useWebSocket<T extends { [key: string]: any }>(
  props: useWebsocketProps<T>
) {
  const { onMessage, path } = props;
  const [isReady, setIsReady] = useState(false);
  const url = `ws://localhost:8000/ws${path}`;
  const ws = useRef<any>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = onMessage;

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  // bind is needed to make sure `send` references correct `this`
  return [isReady, ws.current?.send.bind(ws.current)] as const;
}
 */

import { useEffect, useRef, useState } from "react";
import useAuthStore from "./use-auth-store";

type useWebsocketProps<T> = {
  onMessage: (e: MessageEvent<T>) => any;
  path?: string;
};

export default function useWebSocket<T extends { [key: string]: any }>(
  props: useWebsocketProps<T>
) {
  const access_token = useAuthStore(({ user }) => user?.access_token) ?? "";
  const { onMessage, path = "" } = props;
  const [isReady, setIsReady] = useState(false);
  const ws = useRef<any>(null);

  useEffect(() => {
    if (access_token) {
      const url = `ws://localhost:8000/ws${path}?token=${access_token}`;

      const socket = new WebSocket(url);

      socket.onopen = () => setIsReady(true);
      socket.onclose = () => setIsReady(false);
      socket.onmessage = onMessage;
      ws.current = socket;

      return () => {
        socket.close();
      };
    }
  }, [access_token]);

  // bind is needed to make sure `send` references correct `this`
  return [isReady, ws.current?.send.bind(ws.current)] as const;
}
