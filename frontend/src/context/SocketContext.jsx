import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [liveFeed, setLiveFeed] = useState([]);
  const [scanEvents, setScanEvents] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to the backend (proxied or direct)
    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
    console.log('Connecting socket to:', socketUrl);
    const newSocket = io(socketUrl);
    
    newSocket.on('connect', () => {
      console.log('WebSocket Connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket Disconnected');
      setConnected(false);
    });

    // Listen to live lead events
    newSocket.on('new_lead', (data) => {
      console.log('New Lead Event Received:', data);
      setLiveFeed(prev => [data, ...prev].slice(0, 50)); // Keep last 50 events
    });

    // Listen to wrap scan events
    newSocket.on('scan_event', (data) => {
      console.log('Wrap Scan Event Received:', data);
      setScanEvents(prev => [data, ...prev].slice(0, 50));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, liveFeed, scanEvents, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
