// @ts-nocheck

import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import {
  Flex,
  Text
} from '@chakra-ui/react'
import TileTouchableOpacities from '@/components/PatternGrid';
import Image from 'next/image';
import sun from './../../../public/sun.svg';


export default function Page() {
  const router = useRouter()
  const params = useSearchParams();
  const [user, setUser] = useState(null);
  const [tilePass, setTilePass] = useState([]);
  const [passcode, setPasscode] = useState('0000');
  const { isConnected, sockId, sendUserId, sendPasscode, sendTilePass, tilePassIndex, alarmActive, time } = useSocket();
  const [showMobileWarning, setShowMobileWarning] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setShowMobileWarning(true);
      } else {
        setShowMobileWarning(false);
      }
    };

    checkWidth();

    window.addEventListener('resize', checkWidth);

    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, []);



  const handleRegister = (id: string, password: string) => {
    fetch('http://192.168.0.203:5001/user/register/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setUser(data.user);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    const userId = router.query.userId;
    const alarmId = router.query.id;
    const password = params.get('password');
    if (!userId || !alarmId || !password) return;
    handleRegister(userId as string, password);
  }, [params, router.query]);

  useEffect(() => {
    if (!user) return;
    sendUserId(user.id);
    const newPasscode = generatePasscode();
    const randomPattern = generateRandomOrder();
    setPasscode(newPasscode);
    setTilePass(randomPattern);
    sendPasscode(user.id, newPasscode);
    sendTilePass(user.id, randomPattern);
  }, [user])


  const generatePasscode = () => {
    const passcode = Math.floor(1000 + Math.random() * 9000);
    return passcode.toString();
  }

  const generateRandomOrder = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);
    return shuffledNumbers;
  }

  const formatTimeElapsed = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
    } else if (hours > 0) {
      return `${hours} hours, ${remainingSeconds} seconds`;
    } else if (minutes > 0) {
      return `${minutes} minutes, ${remainingSeconds} seconds`;
    } else {
      return `${remainingSeconds} seconds`;
    }
  }

  return <>
    {showMobileWarning && <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} style={{
      marginTop: '50px'
    }}>
      <Text fontSize="5xl">
        Mobile view not allowed. Get up!
      </Text>
    </Flex>}
    {!showMobileWarning && <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} style={{
      marginTop: '50px'
    }}>
      {alarmActive && <TileTouchableOpacities tilePass={tilePass} tilePassIndex={tilePassIndex} />}
      {!alarmActive && <>
        <Text fontSize="5xl">
          Congratulations, you are awake!
        </Text>
        <Text fontSize="4xl">
          It took you {formatTimeElapsed(time)}!
        </Text>
        <Image
          priority
          src={sun}
          alt="sun-icon"
          width={300}
          height={400}

        />
      </>}
    </Flex >}
  </>
} 