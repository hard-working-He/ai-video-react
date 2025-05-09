import { useEffect, useRef, useState } from "react";
import { queryAIVideoTask, updateAIVideo, getAIVideoList } from "../api/aiVideo";
import { useVideoGenerationStore } from "../store/videoGeneration";
const POLLING_INTERVAL = 10000; // 轮询间隔时间（毫秒）

export default function usePolling(taskId) {
  const pollingTimer = useRef(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);
  const { setAiVideoUrl, setCoverUrl, setVideoList } = useVideoGenerationStore();
  useEffect(() => {
    if (!taskId) {
      stopPolling();
      return;
    }

    setIsPolling(true);
    setError(null);

    const pollStatus = async () => {
      try {
        console.log("轮询任务状态中, taskId:", taskId);
        const { task_status, video_result } = await queryAIVideoTask(taskId);
        console.log("任务状态:", task_status, "视频结果:", video_result);
        if (task_status === "SUCCESS") {
          const { url, cover_image_url } = video_result[0];
          if (!url) {
            console.error("视频URL为空");
            setError("视频URL获取失败");
            stopPolling();
            return;
          }
          console.log("获取到视频URL:", url);
          setAiVideoUrl(url);
          setCoverUrl(cover_image_url);

          // 调用更新视频状态和filePath的接口
          try {
            await updateAIVideo({
              task_id: taskId,
              status: "SUCCESS",
              file_path: url
            });
            console.log("视频状态和filePath更新成功");
          } catch (updateErr) {
            console.error("更新视频状态和filePath失败:", updateErr);
            // 这里我们不设置错误状态，因为视频URL已经成功获取
          }

          setError(null);

          // 更新视频列表
          try {
            const urlList = await getAIVideoList();
            console.log('获取到最新视频列表:', urlList);
            setVideoList(urlList || []); // 更新视频列表到store中
          } catch (listErr) {
            console.error('获取视频列表失败:', listErr);
          }

          stopPolling();
        } else if (task_status === "FAIL") {
          console.log("任务失败，结束轮询");
          setError("视频生成失败，请重试");
          stopPolling();
        } else {
          console.log("任务处理中...");
          pollingTimer.current = setTimeout(pollStatus, POLLING_INTERVAL);
        }
      } catch (err) {
        console.error("轮询出错:", err);
        setError("获取视频状态失败，请刷新重试");
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

  return { isPolling, error };
} 