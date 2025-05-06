import { create } from 'zustand';

export const useBasicSettingsStore = create((set) => ({           // 初始值
  frameRate: '30',//发请求时应该是number
  outputMode: 'quality',
  duration: '5',
  setFrameRate: (frameRate) => set({ frameRate }),
  setOutputMode: (outputMode) => set({ outputMode }),
  setDuration: (duration) => set({ duration })
}));
