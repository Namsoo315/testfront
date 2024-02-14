import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatComponent from './messageTest'; // 경로는 실제 프로젝트 구조에 맞게 조정하세요.

function App() {
  return (
    <Router>
      <div className="App">
        <h1>React Chat App</h1>
        <Routes>
          <Route path="/chat" element={<ChatComponent/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
