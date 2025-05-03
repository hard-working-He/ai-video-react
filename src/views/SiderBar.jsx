import { Layout, Menu, Typography, Space, Avatar } from 'antd';
import { CommentOutlined, ReadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
const { Sider, Content } = Layout;
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const SiderBar = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('ai-video'); // Default to video
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname === '/' ? 'ai-video' : location.pathname.replace('/', '');
    
    useEffect(() => {
        console.log('当前路径:', location.pathname);
        console.log('当前选中菜单:', currentPath);
    }, [location, currentPath]);
    
    const menuItems = [
        { key: 'ai-chat', label: 'ChatGLM', icon: <CommentOutlined /> },
        { key: 'ai-reading', label: 'AI阅读', icon: <ReadOutlined /> },
        { key: 'ai-video', label: 'AI视频', icon: <VideoCameraOutlined /> }/* ,
        { key: 'search', label: 'AI搜索', icon: '🔍' },
        { key: 'image', label: 'AI画图', icon: '🎨' },
        { key: 'read', label: 'AI阅读', icon: '📚' },
        { key: 'ppt', label: 'PPT', icon: '📊' },
        { key: 'data', label: '数据分析', icon: '📈' }, */
    ];
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={220}
                style={{ minHeight: '100vh' }}
                theme="light"
                className="sidebar"
                
            >
                <Space className="logo-container" align="center">
                    <Avatar src="/logo.png" size={32} alt="Logo" />
                    <Typography.Text strong className="logo-text">FULLKIT</Typography.Text>
                </Space>

                <Menu
                    className="menu-container"
                    style={{ minHeight: '100vh' }}
                    mode="inline"
                    selectedKeys={[currentPath]}
                    onClick={({ key }) => {
                        console.log('菜单点击:', key);
                        navigate(`/${key}`);
                    }} 
                    items={menuItems.map(item => ({
                        key: item.key,
                        icon: item.icon,
                        label: item.label,
                    }))}
                />
            </Sider>
            <Content style={{ padding: '20px', backgroundColor: '#fff' }}>
                <Outlet />
            </Content>
        </Layout>   
    )
}

export default SiderBar;