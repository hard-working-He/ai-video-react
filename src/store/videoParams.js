import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Since we don't have access to the original icons,
// we'll assume you have equivalent icons in your project
// Replace these imports with your actual icon imports

const ratioList = [
  {
    label: '16:9',
    value: '16:9',
    ratio: '16-9',
    width: 16,
    height: 9
  },
  {
    label: '9:16',
    value: '9:16',
    ratio: '9-16',
    width: 9,
    height: 16
  },
  {
    label: '1:1',
    value: '1:1',
    ratio: '1-1',
    width: 1,
    height: 1
  },
  {
    label: '4:3',
    value: '4:3',
    ratio: '4-3',
    width: 4,
    height: 3
  },
  {
    label: '3:4',
    value: '3:4',
    ratio: '3-4',
    width: 3,
    height: 4
  }
];

const defaultConfig = {
  generation_pattern: 1,
  resolution: 0,
  fps: 0,
  duration: 1,
  generation_ai_audio: 0,
  generation_ratio_width: 16,
  generation_ratio_height: 9,
  activity_type: 0,
  label_watermark: 0,
  prompt: ''
};

const basicConfigState = [
  {
    title: '生成模式',
    key: 'generation_pattern',
    options: [
      {
        label: '速度更快',
        value: 1,
        icon: SpeedIcon,
        vip: false
      },
      {
        text: '质量更佳',
        label: '质量更佳',
        value: 2,
        desc: '生成视频效果更好，画面清晰细腻',
        icon: QualityIcon,
        extra: 'quality',
        source: 'vip_pc_video_better',
        disabled: false,
        vip: true
      }
    ],
    selected: 1
  },
  {
    title: '视频帧率',
    key: 'fps',
    options: [
      {
        label: '帧率30',
        value: 0,
        icon: Fps10Icon,
        vip: false
      },
      {
        text: '60帧',
        label: '帧率60',
        value: 1,
        icon: Fps60Icon,
        desc: '60帧体验更加流畅的视频画面',
        extra: '60fps',
        source: 'vip_pc_video_60fps',
        vip: true
      }
    ],
    selected: 0
  },
  {
    title: '视频分辨率',
    key: 'resolution',
    options: [
      {
        label: '1080P',
        value: 0,
        icon: ResolutionHdIcon,
        vip: false
      },
      {
        text: '4k',
        label: '4k',
        value: 1,
        icon: Resolution4KIcon,
        desc: '60帧体验更加流畅的视频画面',
        extra: '60fps',
        source: 'vip_pc_video_4k',
        vip: true
      }
    ],
    selected: 0
  },
  {
    title: '生成比例',
    key: 'ratio',
    options: ratioList,
    selected: '16:9'
  }
];

// Create a Zustand store for video parameters
export const useVideoParamsStore = create(
  devtools(
    (set, get) => ({
      // Basic config options
      basicConfigState,
      
      // Cogvideo config state
      cogvideoConfigState: { ...defaultConfig },
      
      // Image to video source state
      img2videoSourceState: {
        source_id: '',
        source_url: '',
        ratioValue: '',
        ratioText: ''
      },
      
      // Set cogvideo state
      setCogvideState: ({ key, value }) => {
        if (key === 'ratio') {
          const { width, height } = ratioList.find(item => item.value === value);
          set((state) => ({
            cogvideoConfigState: {
              ...state.cogvideoConfigState,
              generation_ratio_width: width,
              generation_ratio_height: height
            }
          }));
        } else {
          set((state) => ({
            cogvideoConfigState: {
              ...state.cogvideoConfigState,
              [key]: value
            }
          }));
        }
        
        console.log('cogvideoConfigState', get().cogvideoConfigState);
      },
      
      
      
      // Reset image to video source
      resetImg2videoSource: () => {
        set({
          img2videoSourceState: {
            source_id: '',
            source_url: '',
            ratioValue: '',
            ratioText: ''
          }
        });
      },
      
      // Reset cogvideo input state
      resetCogvideoInputState: () => {
        set({
          cogvideoConfigState: { ...defaultConfig }
        });
      }
    }),
    { name: 'video-params-store' }
  )
);

// Custom hook for easier access to videoParams store
export const useVideoParams = () => {
  const {
    basicConfigState,
    cogvideoConfigState,
    img2videoSourceState,
    setCogvideState,
    setImg2videoSource,
    resetImg2videoSource,
    resetCogvideoInputState
  } = useVideoParamsStore();
  
  return {
    defaultConfig,
    basicConfigState,
    cogvideoConfigState,
    img2videoSourceState,
    setCogvideState,
    setImg2videoSource,
    resetImg2videoSource,
    resetCogvideoInputState
  };
};

export default useVideoParams;
