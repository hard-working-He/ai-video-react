import { Input, Button, Upload, message, Row, Col, Space } from "antd";
import { UploadOutlined, SendOutlined, PlusOutlined } from "@ant-design/icons";
import "./input.css";
import { useVideoGenerationStore } from "../../../store/videoGeneration";
import { generateAIVideo } from "../../../api/aiVideo";
import getBase64 from "../../../utils/image";
import { useState, useCallback } from "react";

const InputContainer = () => {
  const { prompt, setPrompt, setTaskId, error: storeError, setError, imageUrl, setImageUrl } = useVideoGenerationStore();
  const [loading, setLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }

    try {
      const taskId = await generateAIVideo(prompt, imageUrl);
      setTaskId(taskId);
      setError(null);
    } catch (err) {
      console.error("生成错误:", err);
      setError("视频生成失败，请重试");
    }
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只支持 JPG/PNG 格式图片!');
      return false;
    } 
    return true; // 需要返回 true 以允许上传
  }
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);

      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="input-container" style={{ 
      background: 'white', 
      borderRadius: '12px',
      padding: '2px',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      {/* 第一行：上传组件和输入框 */}
      <Row gutter={16} className="input-row" align="middle">
        <Col span={4}>
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            beforeUpload={beforeUpload}
            onPreview={handlePreview}
            onChange={handleChange}
          > 
            {imageUrl ? null : uploadButton}
          </Upload>
        </Col>
        <Col flex="1">
          <Input
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            value={prompt}
            placeholder="通过上传图片或输入描述，创造你的视频"
            style={{ 
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              fontSize: '16px',
              color: '#333',
              marginTop: 0
            }}
          />
        </Col>
      </Row>
      
      {/* 第二行：参数组件和发送按钮 */}
      <Row gutter={16} className="controls-row" style={{ marginTop: 16 }} align="middle">
        <Col flex="1">

        </Col>
        <Col>
          <Button 
            type="primary" 
            shape="circle" 
            size="large"
            onClick={handleGenerate}
            icon={<SendOutlined />}
            style={{ 
              background: '#000', 
              borderColor: '#000',
              boxShadow: 'none'
            }}
          />
        </Col>
      </Row>
      
      {storeError && <div className="error-message">{storeError}</div>}
    </div>
  );
};

export default InputContainer;
