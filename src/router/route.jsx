import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../views/Home';
import AIVideo from '../views/AIVideo';
import AIChat from '../views/AIChat';
import AIReading from '../views/AIReading';
import SiderBar from '../views/SiderBar';

const router = createBrowserRouter([
    {
        path: '/',
        element: <SiderBar />,
        children: [
            {
                index: true,
                element: <Navigate to="/ai-video" replace />
            },
            {
                path: 'ai-video',
                element: <AIVideo />,
            },
            {
                path: 'ai-chat',   
                element: <AIChat />,
            },
            {
                path: 'ai-reading',
                element: <AIReading />,
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/ai-video" replace />
    }
]);

export default router;
