// useLoading.jsx
import { useEffect, useCallback, useState } from 'react';
import { message, Spin } from 'antd';
import { createRoot } from 'react-dom/client';

// 全局 loading 管理 hook
export function useGlobalLoading() {
  // 使用闭包在函数组件外保持状态
  const loadingState = useState(() => ({
    count: 0,
    messageInstance: null
  }))[0];
  
  const showGlobalLoading = useCallback((text = '加载中...') => {
    loadingState.count++;
    if (loadingState.count === 1) {
      loadingState.messageInstance = message.loading(text, 0);
    }
  }, [loadingState]);
  
  const hideGlobalLoading = useCallback(() => {
    if (loadingState.count > 0) loadingState.count--;
    if (loadingState.count === 0 && loadingState.messageInstance) {
      loadingState.messageInstance();
      loadingState.messageInstance = null;
    }
  }, [loadingState]);
  
  return { showGlobalLoading, hideGlobalLoading };
}

// 创建一个单例存储所有局部loading的状态
const localLoadingContainers = new Map(); // 存储每个局部loading的容器及引用计数
const localLoadingRoots = new Map(); // 存储React 18的root实例

// 局部 loading 管理 hook
export function useLocalLoading(targetId) {
  const showLocalLoading = useCallback((text = '加载中...') => {
    if (!targetId) return;
    
    const target = document.getElementById(targetId);
    if (!target) return;
    
    if (!localLoadingContainers.has(targetId)) {
      // 创建loading容器
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.background = 'rgba(255, 255, 255, 0.7)';
      container.style.zIndex = '999';
      
      target.style.position = 'relative';
      target.appendChild(container);
      
      // 使用React 18的createRoot API渲染Spin组件
      const root = createRoot(container);
      root.render(<Spin tip={text} size="large" />);
      
      localLoadingContainers.set(targetId, {
        count: 1,
        container,
        target
      });
      
      localLoadingRoots.set(targetId, root);
    } else {
      // 增加引用计数
      const item = localLoadingContainers.get(targetId);
      item.count++;
    }
  }, [targetId]);
  
  const hideLocalLoading = useCallback(() => {
    if (!targetId || !localLoadingContainers.has(targetId)) return;
    
    const item = localLoadingContainers.get(targetId);
    item.count--;
    
    if (item.count === 0) {
      // 使用React 18的unmount方法卸载组件
      if (localLoadingRoots.has(targetId)) {
        const root = localLoadingRoots.get(targetId);
        root.unmount();
        localLoadingRoots.delete(targetId);
      }
      
      item.target.removeChild(item.container);
      localLoadingContainers.delete(targetId);
    }
  }, [targetId]);
  
  // 组件卸载时自动清理
  useEffect(() => {
    return () => {
      if (targetId && localLoadingContainers.has(targetId)) {
        // 确保在组件卸载时清理所有loading
        const item = localLoadingContainers.get(targetId);
        if (localLoadingRoots.has(targetId)) {
          const root = localLoadingRoots.get(targetId);
          root.unmount();
          localLoadingRoots.delete(targetId);
        }
        
        item.target.removeChild(item.container);
        localLoadingContainers.delete(targetId);
      }
    };
  }, [targetId]);
  
  return { showLocalLoading, hideLocalLoading };
}
