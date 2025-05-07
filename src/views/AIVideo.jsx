import InputContainer from '../components/AIVideo/InputContainer/index';
import { useVideoGenerationStore } from '../store/videoGeneration';
import VideoItem from "../components/AIVideo/VideoItem";
import usePolling from '../hooks/usePolling';
import VideoList from "../components/AIVideo/VideoList";
import { getAIVideoList, generateAIVideo } from '../api/aiVideo';
import { useEffect, useState, useCallback } from 'react';
import { Layout, Typography } from 'antd';
import { 
  CommentOutlined, 
  ReadOutlined, 
  VideoCameraOutlined
} from '@ant-design/icons';
import './AIVideo.css'; // We'll keep the CSS for now, but you might want to modify it later
import { AIVideoProvider } from '../context/AIVideoContext';

const { Header, Content } = Layout;
const { Title } = Typography;

const AIVideo = () => {
  const { 
    aiVideoUrl, 
    taskId, 
    prompt, 
    imageUrl, 
    setTaskId, 
    setError,
    videoList,
    setVideoList 
  } = useVideoGenerationStore();
  const { isPolling, isLoading, error } = usePolling(taskId);
  
  // 初始加载时获取视频列表
  useEffect(() => {
    console.log('AIVideo 组件已挂载');
    fetchUrlList();
  }, []);

  // Function to fetch video list
  const fetchUrlList = async () => {
    try {
      const urlList = await getAIVideoList();
      console.log('获取到视频列表:', urlList);
      setVideoList(urlList || []);
    } catch (error) {
      console.error('获取视频列表失败:', error);
      setVideoList([]);
    }
  };

  return (
    <AIVideoProvider>
      <Layout className="home-container">
        <Layout className="content-area">
          <Header className="header">
            <Title level={3} style={{ margin: 0 }}>AI视频</Title>
          </Header>
          
          <Content className="video-section" style={{ padding: '20px' }}>
            <div className="video-list-wrapper">
              <VideoList urlList={videoList || []} />
            </div>
            <div className="input-section">
              <InputContainer />
            </div>
          </Content>
        </Layout>
      </Layout>
    </AIVideoProvider>
  );
};

export default AIVideo;