import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/route.jsx';

function App() {
  console.log('App组件已渲染');
  
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
