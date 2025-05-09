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
  const url = 'https://open.bigmodel.cn/api/paas/v4/assistant';
  
  /* if (!params.model || !params.messages) {
    throw new Error('model和messages不能为空');
  } */
  const params = {
    assistant_id: '659e54b1b8006379b4b2abd6',
    model: 'glm-4-assistant', 
    stream: 'true',
    messages:[
      {
          "role": "user",
          "content": [{
              "type": "text",
              "text": "请综合分析2025年Q1中东地缘政治冲突对全球能源市场的影响，结合原油价格波动、主要产油国政策调整及欧洲能源替代方案数据，生成带时间轴的风险评估报告，并标注期货市场实时反应与关键机构（如IEA）的应对建议。"
          }]
      }
  ],
  stream: true,
  attachments: null,
  metadata: null
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
              const data = line.slice(6);
              if (data === '[DONE]') return;
              try {
                const parsed = JSON.parse(data);
                let content = '';
                
                // 处理工具调用响应
                if (parsed.choices[0]?.delta?.tool_calls) {
                  const toolCalls = parsed.choices[0].delta.tool_calls;
                  for (const tool of toolCalls) {
                    if (tool.type === 'web_browser' && tool.web_browser?.outputs) {
                      // 将搜索结果格式化为 Markdown
                      content = tool.web_browser.outputs
                        .map(output => {
                          return `### [${output.title}](${output.link})\n\n${output.content}\n\n---\n`;
                        })
                        .join('\n');
                    }
                  }
                } 
                // 处理普通文本响应
                else if (parsed.choices[0]?.delta?.content) {
                  content = parsed.choices[0].delta.content;
                }

                if (content) {
                  yield {
                    choices: [{
                      delta: { content },
                      message: content
                    }]
                  };
                }
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
