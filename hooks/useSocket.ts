// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const socket = io('http://192.168.0.203:5001/');

  const [isConnected, setIsConnected] = useState(false);
  const [alarmActive, setAlarmActive] = useState(true);
  const [sockId, setSockId] = useState("");
  const [tilePassIndex, setTilePassIndex] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setTime(0);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
      setSockId(socket.id as string);
      setIsConnected(true);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
    socket.on('Alarm', () => {
      resetTimer();
      startTimer();

    });

    socket.on('TileIndex', (message) => {
      setTilePassIndex(message.data);
    })

    socket.on('Finish', () => {
      setAlarmActive(false);
      stopTimer();
    })

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendUserId = (userId: Number) => {
    socket.emit('beaconDeviceConnected', userId);
  }

  const sendPasscode = (id: Number, passcode: String) => {
    socket.emit('beaconDevicePasscode', { id: id, passcode: passcode });
  }

  const sendTilePass = (id: Number, tilePass: Array<Number>) => {
    socket.emit('beaconDeviceTilePasscode', { id: id, tilePass: tilePass, index: tilePassIndex })
  }


  return { isConnected, sockId, sendUserId, sendPasscode, sendTilePass, tilePassIndex, alarmActive, time };
}