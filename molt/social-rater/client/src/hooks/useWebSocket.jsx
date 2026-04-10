import { useEffect, useRef, useCallback, useState } from 'react';

export function useWebSocket() {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef({});

  const on = useCallback((type, callback) => {
    if (!listenersRef.current[type]) listenersRef.current[type] = [];
    listenersRef.current[type].push(callback);
    return () => {
      listenersRef.current[type] = listenersRef.current[type].filter(cb => cb !== callback);
    };
  }, []);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const url = `${protocol}//${host}/ws`;

    let ws;
    let reconnectTimer;

    function connect() {
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        // Ping every 25s to keep alive
        ws._pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
        }, 25000);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'pong') return;
          const handlers = listenersRef.current[msg.type] || [];
          handlers.forEach(cb => cb(msg.data, msg.ts));
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        clearInterval(ws._pingInterval);
        // Reconnect after 3s
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        clearInterval(wsRef.current._pingInterval);
        wsRef.current.close();
      }
    };
  }, []);

  return { connected, on };
}
