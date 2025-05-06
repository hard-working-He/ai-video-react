import { Button, Row, Col } from "antd";
import { SendOutlined } from "@ant-design/icons";
import "./input.css";
import { useVideoGenerationStore } from "../../../store/videoGeneration";
import { useState, useEffect } from "react";
import PickVideo from "../../pickVideo";
import { useAIVideo } from '../../../context/AIVideoContext';
import VideoBasicSetting from "../VideoBasicSetting";
import getBase64 from "../../../utils/image";
import { get } from "lodash";
const InputContainer = () => {
  const { originFile, setOriginFile, prompt, setPrompt, error: storeError, setError } = useVideoGenerationStore();
  
  const { handleGenerate } = useAIVideo();

  // 处理Enter键提交
  const handleKeyPress = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleGenerate();
    }
  }
  
  return (
    <div className="input-container">
      {/* 第一行：上传组件和输入框 */}
      <Row gutter={16} className="input-row" align="middle">
        <Col span={3}>
          <PickVideo 
            croppedFile={originFile}
            onUploaded={(file, ratio) => {
              if (file && file instanceof File) {
                setOriginFile(file);
              } else if (file) {
                console.error('从PickVideo接收到无效文件', file);
              }
            }}
          />
        </Col>
        <Col flex="1">
          <textarea
            onChange={e => {
              setPrompt(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            value={prompt}
            placeholder="通过上传图片或输入描述，创造你的视频"
            rows="3"
            className="input-textarea"
          />
        </Col>
      </Row>

      {/* 第二行：参数组件和发送按钮 */}
      <Row gutter={16} className="controls-row" align="middle">
        <Col flex="1">
          <VideoBasicSetting />
        </Col>
        <Col>
          <Button
            type="primary"
            shape="circle"
            size="large"
            onClick={handleGenerate}
            icon={<SendOutlined />}
            className="send-button"
          />
        </Col>
      </Row>

      {storeError && <div className="error-message">{storeError}</div>}
    </div>
  );
};

export default InputContainer;
