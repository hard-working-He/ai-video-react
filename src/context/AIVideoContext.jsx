import React, { createContext, useContext, useCallback } from 'react';
import { useVideoGenerationStore } from '../store/videoGeneration';
import { generateAIVideo, addAIVideo, getAIVideoList } from '../api/aiVideo';
import { downloadTool } from '../utils/downloadVideo';
import { useBasicSettingsStore } from '../store/videoParams';

// 创建 Context
const AIVideoContext = createContext(null);

// 创建 Provider 组件
export const AIVideoProvider = ({ children }) => {
  const { 
    prompt, 
    imageUrl, 
    setTaskId, 
    setError,
    setPrompt,
    setVideoList
  } = useVideoGenerationStore();
  const {  frameRate, outputMode, duration } = useBasicSettingsStore();
  // 生成视频方法
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }

    try {
      console.log('正在生成AI视频，提示词:', prompt, '图片URL:', imageUrl);
      const taskId = await generateAIVideo(prompt, imageUrl, frameRate, outputMode);
      setTaskId(taskId);
      
      // 调用 addAIVideo 接口
      await addAIVideo({
        task_id: taskId,
        creation_params: prompt,
        status: 'PROCESSING'
      });
       // 更新视频列表
       try {
        const urlList = await getAIVideoList();
        console.log('获取到最新视频列表:', urlList);
        setVideoList(urlList || []); // 更新视频列表到store中
      } catch (listErr) {
        console.error('获取视频列表失败:', listErr);
      }
      
      
      setError(null);
      // 清空输入框
      setPrompt('');
      setOriginFile(null);
      
    } catch (err) {
      console.error("生成错误:", err);
      setError("视频生成失败，请重试");
    }
  }, [prompt, imageUrl, setTaskId, setError, setPrompt]);

  // 下载视频方法
  const handleDownload = useCallback((videoUrl) => {
    const processedUrl = videoUrl?.split(".cn")[1]?.replace("api", "zhipu");
    downloadTool(processedUrl, 'video.mp4');
  }, []);

  // 提供方法给子组件
  const contextValue = {
    handleGenerate,
    handleDownload
  };

  return (
    <AIVideoContext.Provider value={contextValue}>
      {children}
    </AIVideoContext.Provider>
  );
};

// 创建自定义 Hook 方便使用
export const useAIVideo = () => {
  const context = useContext(AIVideoContext);
  if (!context) {
    throw new Error('useAIVideo 必须在 AIVideoProvider 内部使用');
  }
  return context;
}; 