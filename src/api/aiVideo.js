import { apiKey } from './apiKey';
import { useGlobalLoading } from '../hooks/useLoading';
import { post } from './request';
/**
 * 创建AI视频生成任务
 * @param {Object} params - 请求参数
 * @param {string} params.model - 模型编码
 * @param {string} [params.prompt] - 视频的文本描述 (与image_url二选一或同时传入)
 * @param {string} [params.quality] - 输出模式，"quality"或"speed"，默认为"speed"
 * @param {boolean} [params.with_audio] - 是否生成AI音效，默认为false
 * @param {string} [params.image_url] - 基础图像URL或Base64 (与prompt二选一或同时传入)
 * @param {string} [params.size] - 视频分辨率，默认根据原图比例生成
 * @param {number} [params.fps] - 视频帧率，可选30或60，默认为30
 * @param {string} [params.request_id] - 请求唯一标识
 * @param {string} [params.user_id] - 终端用户唯一ID
 * @returns {Promise<Object>} - 返回包含任务ID等信息的响应
 */
export const generateAIVideo = async (prompt, imageUrl, ratio, frameRate, outputMode) => {
  const url = 'https://open.bigmodel.cn/api/paas/v4/videos/generations';
  
  // 检查输入：prompt 和 imageUrl 至少需要提供一个
  if (!prompt && !imageUrl) {
    throw new Error('提示词和图片URL至少需要提供一个');
  }
  
  try {
    // 准备请求体
    const requestBody = {
      model: 'cogvideox-2',
      quality: outputMode === 'quality' ? "quality" : "speed" , 
      with_audio: true,
      size: "1920x1080",
      fps: Number(frameRate)===30 ? 30 : 60,
    };
    
    // 添加 prompt 或 imageUrl (或两者)
    if (prompt) {
      requestBody.prompt = prompt;
    }
    
    if (imageUrl) {
      requestBody.image_url = imageUrl;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`请求失败: ${response.status} ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log('AI视频生成响应:', data.id);
    return data.id;
  } catch (error) {
    console.error('AI视频生成请求出错:', error);
    throw error;
  }
};

/**
 * 查询AI视频生成任务状态和结果
 * @param {string} taskId - 任务ID，即创建任务时返回的id
 * @returns {Promise<Object>} - 返回任务状态和结果
 */
export const queryAIVideoTask = async (taskId) => {
  if (!taskId) {
    throw new Error('任务ID不能为空');
  }
  
  const url = `https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': apiKey
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`查询失败: ${response.status} ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('查询AI视频任务出错:', error);
    throw error;
  }
};


//获取AI视频列表  
export const getAIVideoList = async () => {
  const url = '/api/v1/videos/videolists';
  const response = await post(url, {});
  return response.data;
};
/* 
增加新视频，在generateAIVideo返回的taskId后，增加新视频 
状态：PROCESSING（处理中），SUCCESS（成功），FAIL（失败）
参数：
{
  "task_id": "1234567890",
  "creation_params": "狗"
  "status": "PROCESSING",
}
   */
export const addAIVideo = async (params) => {
  const url = '/api/v1/videos/newvideo';
  const response = await post(url, params);
  return response.data;
};

/* 
更新视频状态和filePath

参数：
{
  "task_id": "1234567890",
  "status": "SUCCESS",
  "file_path": "/path/to/video/file.mp4"
}
 */
export const updateAIVideo = async (params) => {
  const url = '/api/v1/videos/update';
  const response = await post(url, params);
  return response.data;
};


