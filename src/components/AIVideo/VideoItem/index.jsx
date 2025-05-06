import { Button } from "antd";
import { 
  CustomerServiceOutlined, 
  SoundOutlined, 
  DownloadOutlined, 
  EllipsisOutlined 
} from "@ant-design/icons";
import { downloadTool } from "../../../utils/downloadVideo";
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import debounce from "lodash/debounce";
import "./video.css";
import usePolling from "../../../hooks/usePolling";
import { useAIVideo } from '../../../context/AIVideoContext';

const VideoItem = forwardRef(({ 
  videoUrl, 
  coverUrl, 
  taskId, 
  isPolling, 
  isLoading, 
  error, 
  audioUrl,
  ratio = 1.5,
  caption , // Default caption
}, ref) => {
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const { handleDownload } = useAIVideo();

  // Calculate video size based on window and container dimensions
  const calcVideoSize = () => {
    const screenDom = playerRef.current;
    if (!screenDom) return;
    
    const container = document.querySelector('.video-container');
    if (!container) return;
    
    const containerWidth = parseFloat(getComputedStyle(container).getPropertyValue('width'));
    const containerHeight = parseFloat(getComputedStyle(container).getPropertyValue('height'));
    
    let width = containerWidth;
    let height = width / ratio;
    
    if (ratio < 1) {
      // 竖屏视频
      height = containerWidth / ratio;
      screenDom.style.width = '100%';
      screenDom.style.height = `${height}px`;
    } else {
      // 横屏视频
      screenDom.style.width = '100%';
      screenDom.style.height = 'auto';
    }
    screenDom.style.aspectRatio = `${ratio}`;
  };

  const calcVideoSizeDebounce = debounce(calcVideoSize, 100);

  useEffect(() => {
    window.addEventListener('resize', calcVideoSizeDebounce);
    calcVideoSize();
    
    return () => {
      window.removeEventListener('resize', calcVideoSizeDebounce);
    };
  }, [ratio]);
  const onDownload = () => {
    handleDownload(videoUrl);
  } 
  // Handle video play/pause
  const handleVideoPlay = () => {
    console.log('Video started playing');
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  const handleVideoPause = () => {
    console.log('Video paused');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  // Video controls functions exposed to parent components
  const reloadVideo = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
      playerRef.current.load();
    }
  };

  const resetVideo = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
    }
  };

  const play = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const pause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      handleVideoPause();
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    reloadVideo,
    resetVideo,
    play,
    pause,
    calcVideoSize
  }));

  return (
    <div className="video-container">
      {videoUrl && (
        <>
          <video
            ref={playerRef}
            src={videoUrl}
            poster={coverUrl}
            controls
            autoPlay
            loop
            preload="auto"
            className={`video-player ${ratio > 1 ? 'video-player-w' : 'video-player-h'} ${audioUrl ? 'merge' : ''}`}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          />
          {audioUrl && (
            <audio 
              ref={audioRef} 
              controls 
              src={audioUrl} 
              loop 
              style={{ display: 'none' }}
            />
          )}
          {/* Caption container */}
          <div className="video-caption-container">
            <div className="video-caption">{caption}</div>
            <div className="video-actions">
              <button className="action-button">
                <CustomerServiceOutlined />
              </button>
              <button className="action-button">
                <SoundOutlined />
              </button>
              <button className="action-button" onClick={onDownload} >
                <DownloadOutlined />
              </button>
              <button className="action-button">
                <EllipsisOutlined />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default VideoItem;