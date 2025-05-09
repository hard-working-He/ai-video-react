import Markdown from "../components/Markdown";
import { useState, useRef } from "react";
import { createAIChatTask } from "../api/aiChat";
const AIReading = () => {
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
          console.log(incrementalContent);
          // 累加显示内容
          setMessage(prev => prev + incrementalContent);
        }
      } catch (error) {
        console.error('处理聊天流失败:', error);
      } finally {
        isStreamingRef.current = false;
      }
    };
    return (
        <div>
            <button onClick={handleChat}>点击</button>
            <Markdown content={message}/>
        </div>
    )
}

export default AIReading;   