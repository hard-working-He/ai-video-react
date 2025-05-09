import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import './index.css';
import bgVideo from "../../../assets/aiSearchBg.mp4";
import InputBox from '../InputBox';
import { useSearchStore } from '../../../store/useSearch';
import { createAIChatTask } from '../../../api/aiChat';
const AISearchFrontpage = ({ isDarkMode = false, triggerSearch, fileList = [] }) => {
  const { searchParams, setSearchParams } = useSearchStore();
  const handleClick = async () => {
    const result = await createAIChatTask();
    console.log(result);
  }
  return (
    <div className="aisearch-frontpage-container">
      <div className="video-container">
        <video autoPlay loop muted key={isDarkMode ? 'dark' : 'light'}>
          <source
            src={bgVideo}
            type="video/mp4"
          />
        </video>
      </div>
      
   
      
      <div className="agent-introduction">
        <div className="agent-name">AI搜索</div>
        <div className="agent-description">智能搜索，精准直达</div>
      </div>
     
      <InputBox searchParams={searchParams} setSearchParams={setSearchParams} handleClick={handleClick}/>
    </div>
  );
};

export default AISearchFrontpage;
