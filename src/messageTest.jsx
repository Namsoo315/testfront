import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

function ChatComponent() {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]); // 메시지 목록 상태

  useEffect(() => {
    // 자동 연결 로직
    const newClient = new Client({
      brokerURL: 'ws://localhost:9090/user', // 서버의 WebSocket 연결 URL
      onConnect: () => {
        console.log('Connected!');
        fetchMessages(); // 웹소켓 연결 성공 시 메시지 목록 불러오기
        newClient.subscribe('/user/queue/messages', (message) => {
          console.log('Received:', JSON.parse(message.body));
          // 수신된 메시지를 메시지 목록에 추가
          setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    newClient.activate();
    setClient(newClient);

    return () => {
      if (newClient) {
        newClient.deactivate();
      }
    };
  }, []);

  // 메시지 목록을 불러오는 함수
  const fetchMessages = async () => {
    axios.get('http://localhost:9090/api/messages', {
      params: {
        senderId: 'user1',
        receiverId: 'user2',
      }
    })
    .then(response => {
      setMessages(response.data.data); // API 응답에서 불러온 메시지 목록을 상태에 저장
    })
    .catch(error => {
      console.error('메시지 목록을 가져오는데 실패했습니다.', error);
    });
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (client) {
      client.publish({
        destination: '/app/chat',
        body: JSON.stringify({
          message: 'Hello, World!',
          senderId: 'user1',
          receiverId: 'user2',
        }),
      });
    } else {
      console.log('Client is not connected.');
    }
  };

  return (
    <div>
      <div>Chat Component</div>
      <button onClick={sendMessage}>Send Message</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.message} - From: {msg.senderId}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChatComponent;
