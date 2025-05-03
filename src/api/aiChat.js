//https://open.bigmodel.cn/api/paas/v4/chat/completions
import { apiKey } from './apiKey';
import { useGlobalLoading } from '../hooks/useLoading';
import { post } from './request';

/**
 * 创建AI聊天任务
 * @param {Object} params - 请求参数
 * @param {string} params.model - 模型编码
 * @param {string} params.messages - 对话消息
 * @param {string} [params.stream] - 是否流式输出，"true"
 * @param {string} [params.user_id] - 终端用户唯一ID
 * @param {string} [params.request_id] - 请求唯一标识
 * @returns {Promise<Object>} - 返回包含任务ID等信息的响应
 */
//SSE流式输出

export const createAIChatTask = async (params) => {
  const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  
  if (!params.model || !params.messages) {
    throw new Error('model和messages不能为空');
  }
  params.stream = 'true';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP错误: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('创建AI聊天任务失败:', error);
    throw error;
  }
}
