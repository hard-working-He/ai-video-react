import { useEffect, useRef, useState } from "react";
import { queryAIVideoTask } from "../api/aiVideo";
import { useVideoGenerationStore } from "../store/videoGeneration";
const POLLING_INTERVAL = 3000; // 轮询间隔时间（毫秒）

export default function usePolling(taskId) {
  const pollingTimer = useRef(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setAiVideoUrl ,setCoverUrl} = useVideoGenerationStore();
  useEffect(() => {
    if (!taskId) {
      stopPolling();
      return;
    }

    setIsPolling(true);
    setError(null);
    setIsLoading(true);

    const pollStatus = async () => {
      try {
        console.log("轮询任务状态中, taskId:", taskId);
        const { task_status, video_result } = await queryAIVideoTask(taskId);
        console.log("任务状态:", task_status, "视频结果:", video_result);
        if (task_status === "SUCCESS") {
          const { url,cover_image_url } = video_result[0];
          if (!url) {
            console.error("视频URL为空");
            setError("视频URL获取失败");
            setIsLoading(false);
            stopPolling();
            return;
          }
          console.log("获取到视频URL:", url);
          setAiVideoUrl(url);
          setCoverUrl(cover_image_url);

          setError(null);
          setIsLoading(false);
          
          // 更新视频列表
        
          
          
          stopPolling();
        } else if (task_status === "FAIL") {
          console.log("任务失败，结束轮询");
          setError("视频生成失败，请重试");
          setIsLoading(false);
          stopPolling();
        } else {
          console.log("任务处理中...");
          pollingTimer.current = setTimeout(pollStatus, POLLING_INTERVAL);
        }
      } catch (err) {
        console.error("轮询出错:", err);
        setError("获取视频状态失败，请刷新重试");
        setIsLoading(false);
        stopPolling();
      }
    };

    pollStatus(); // 立刻发起第一次请求

    return () => {
      stopPolling();
    };
  }, [taskId]); // 只要 taskId 变化，就重新轮询

  const stopPolling = () => {
    if (pollingTimer.current) {
      clearTimeout(pollingTimer.current);
      pollingTimer.current = null;
    }
    setIsPolling(false);
  };

  return { isPolling, isLoading, error };
} 