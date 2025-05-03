import InputContainer from '../components/AIVideo/InputContainer/index';
import { useVideoGenerationStore } from '../store/videoGeneration';
import VideoItem from "../components/AIVideo/VideoItem";
import usePolling from '../hooks/usePolling';
import VideoList from "../components/AIVideo/VideoList";
import { getAIVideoList } from '../api/aiVideo';
import { useEffect, useState } from 'react';
import { Layout, Typography } from 'antd';
import { 
  CommentOutlined, 
  ReadOutlined, 
  VideoCameraOutlined
} from '@ant-design/icons';
import './AIVideo.css'; // We'll keep the CSS for now, but you might want to modify it later

const { Header, Content } = Layout;
const { Title } = Typography;

const AIVideo = () => {
  const { aiVideoUrl, taskId } = useVideoGenerationStore();
  const { isPolling, isLoading, error } = usePolling(taskId);
  const [urlList, setUrlList] = useState([]);
  
  useEffect(() => {
    console.log('AIVideo 组件已挂载');
    
    const fetchUrlList = async () => {
      try {
        console.log('正在获取视频列表...');
        const urlList = await getAIVideoList();
        console.log('获取到视频列表:', urlList);
        setUrlList(urlList || []);
      } catch (error) {
        console.error('获取视频列表失败:', error);
        setUrlList([]);
      }
    };  
    fetchUrlList();
  }, []);
  

  return (
    <Layout className="home-container">
      <Layout className="content-area">
        <Header className="header">
          <Title level={3} style={{ margin: 0 }}>AI视频</Title>
        </Header>
        
        <Content className="video-section" style={{ padding: '20px' }}>
          <div className="video-list-wrapper">
            
            <VideoList urlList={urlList || []} />
          </div>
          <div className="input-section">
            <InputContainer />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AIVideo;