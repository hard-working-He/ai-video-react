import React, { useState, useRef } from 'react';
import { createAIChatTask } from '../../../api/aiChat';

function SearchAnswer() {
  const [message, setMessage] = useState('');
  const isStreamingRef = useRef(false);

  const handleChat = async () => {
    // 开始新的对话时清空消息
    setMessage('');
    isStreamingRef.current = true;

    const chatStream = await createAIChatTask();
    
    try {
      for await (const chunk of chatStream) {
        if (!isStreamingRef.current) break; // 允许中断流式传输
        // 只获取增量内容
        const incrementalContent = chunk.choices[0].delta.content;
        // 累加显示内容
        setMessage(prev => prev + incrementalContent);
      }
    } catch (error) {
      console.error('处理聊天流失败:', error);
    } finally {
      isStreamingRef.current = false;
    }
  };

  // 可选：添加停止生成的功能
  const handleStop = () => {
    isStreamingRef.current = false;
  };

  return (
    <div>
      <button onClick={handleChat}>发送消息</button>
      <button onClick={handleStop}>停止生成</button>
      <div 
        style={{ 
          whiteSpace: 'pre-wrap',
          minHeight: '100px',
          border: '1px solid #ccc',
          padding: '10px',
          marginTop: '10px'
        }}
      >
        {message}
      </div>
    </div>
  );
}

export default SearchAnswer;
