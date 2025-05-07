// store/videoGeneration.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const useVideoGenerationStore = create(
  persist(
    (set) => ({
      taskId: '',//任务id
      isPolling: false,//是否轮询 
      isLoading: false,//是否加载中
      originFile: null,//用户上传的文件
      imageUrl: '',//提供的图片URL地址或者 Base64 编码
      prompt: '',//用户输入的提示词
      coverUrl: '',//ai视频封面url
      aiVideoUrl: '',//ai视频url
      error: null,//错误信息
      pollingTimer: null,//轮询定时器
      videoList: [], // 视频列表

      setTaskId: (taskId) => set({ taskId }),
      setIsPolling: (isPolling) => set({ isPolling }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setOriginFile: (originFile) => set({ originFile }), 
      setImageUrl: (imageUrl) => set({ imageUrl }), 
      setPrompt: (prompt) => set({ prompt }),
      setCoverUrl: (coverUrl) => set({ coverUrl }),
      setAiVideoUrl: (aiVideoUrl) => set({ aiVideoUrl }),
      setError: (error) => set({ error }),
      setPollingTimer: (pollingTimer) => set({ pollingTimer }),
      setVideoList: (videoList) => set({ videoList }), // 设置视频列表

      reset: () => set({
        taskId: null,
        isPolling: false,
        isLoading: false,
        prompt: '',
        coverUrl: '',
        aiVideoUrl: null,
        error: null,
        pollingTimer: null,
        videoList: [], // 重置时清空视频列表
      }),
    }),
    {
      name: 'videoGeneration',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
