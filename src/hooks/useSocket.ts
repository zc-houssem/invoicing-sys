import React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthPersistStore } from './stores/useAuthPersistStore';

const SOCKET_URL =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.BASE_URL;

const useSocket = (path: string) => {
  const authPersistStore = useAuthPersistStore();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const newSocket = io(SOCKET_URL || '', {
      path,
      extraHeaders: {
        Authorization: `Bearer ${authPersistStore.accessToken}`
      }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket:', path);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      newSocket.disconnect();
      console.log('Disconnected from socket:', path);
    };
  }, [path, authPersistStore.accessToken]);

  return socket;
};

export default useSocket;
