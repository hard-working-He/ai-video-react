import { Button } from "antd";
import { downloadTool } from "../../utils/downloadVideo";
import "./video.css";
import usePolling from "../../hooks/usePolling";

const VideoItem = ({AIUrl,taskId,isPolling,isLoading,error,coverUrl}) => {
      
  return (
    <div className="video-container">
      {AIUrl ? (
        <video
          src={AIUrl}
          poster={coverUrl}
          controls
          autoPlay
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        />
      ) : (
        <div className="video-placeholder">
          {isLoading ? "视频生成中..." : error || "请输入提示词生成视频"}
        </div>
      )}
      {AIUrl && (
        <Button 
          onClick={() => downloadTool(AIUrl?.split(".cn")[1], 'video.mp4')}
          className="download-button"
        >
          下载
        </Button>
      )}
      <div>
      {"请输入提示词生成视频"}
      </div>
    </div>
  );
};

export default VideoItem; 