// store/videoGeneration.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const useVideoGenerationStore = create(
  persist(
    (set) => ({
      taskId: '',
      isPolling: false,
      isLoading: false,
      prompt: '',
      imageUrl: '',
      aiVideoUrl: '',
      error: null,
      pollingTimer: null,

      setTaskId: (taskId) => set({ taskId }),
      setIsPolling: (isPolling) => set({ isPolling }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setPrompt: (prompt) => set({ prompt }),
      setImageUrl: (imageUrl) => set({ imageUrl }),
      setCoverUrl: (coverUrl) => set({ coverUrl }),
      setAiVideoUrl: (aiVideoUrl) => set({ aiVideoUrl }),
      setError: (error) => set({ error }),
      setPollingTimer: (pollingTimer) => set({ pollingTimer }),

      reset: () => set({
        taskId: null,
        isPolling: false,
        isLoading: false,
        prompt: '',
        imageUrl: '',
        coverUrl: '',
        aiVideoUrl: null,
        error: null,
        pollingTimer: null,
      }),
    }),
    {
      name: 'videoGeneration',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
