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

export const createAIChatTask = async () => {
  const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  
  /* if (!params.model || !params.messages) {
    throw new Error('model和messages不能为空');
  } */
  const params = {
    model: 'glm-4-air', 
    stream: 'true',
    messages: [
      {
        role: 'user',
        content: '你好'
      }
    ],
    tools: [{
      type: 'web_search',
      web_search: {
        enable: true,
        search_engine: 'search_std',
        search_prompt: '你是一位智能问答专家，具备整合信息的能力，能够进行时间识别、语义理解与矛盾信息清洗处理。确保答案具有实时性与权威性，直接陈述'
      }
    }]
  };


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

    // 处理 SSE 流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let currentMessage = '';
    
    // 返回一个异步迭代器
    return {
      async *[Symbol.asyncIterator]() {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // 移除 'data: ' 前缀
              if (data === '[DONE]') return;
              try {
                const parsed = JSON.parse(data);
                // 获取增量内容
                const content = parsed.choices[0]?.delta?.content || '';
                currentMessage += content;
                // 返回完整的数据结构，包括当前累积的消息
                yield {
                  ...parsed,
                  choices: [{
                    ...parsed.choices[0],
                    delta: {
                      ...parsed.choices[0].delta,
                      content,
                    },
                    message: currentMessage // 添加累积的完整消息
                  }]
                };
              } catch (e) {
                console.warn('解析SSE数据失败:', e);
              }
            }
          }
        }
      }
    };
  } catch (error) {
    console.error('创建AI聊天任务失败:', error);
    throw error;
  }
}
