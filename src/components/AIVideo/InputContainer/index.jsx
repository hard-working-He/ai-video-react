import { Input, Button, Upload, message, Row, Col, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./input.css";
import { useVideoGenerationStore } from "../../../store/videoGeneration";
import { generateAIVideo } from "../../../api/aiVideo";
import getBase64 from "../../../utils/image";
import { useState } from "react";

const InputContainer = () => {
  const { prompt, setPrompt, setTaskId, error: storeError, setError, imageUrl, setImageUrl } = useVideoGenerationStore();
  const [loading, setLoading] = useState(false);

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
  return (
    <div className="input-container">
      {/* 第一行：上传组件和输入框 */}
      <Row gutter={16} className="input-row">
        <Col>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div>
                {loading ? 'Loading...' : <UploadOutlined />}
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )}
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
              boxShadow: 'none'
            }}
          />
        </Col>
      </Row>
      
      {/* 第二行：参数组件和发送按钮 */}
      <Row gutter={16} className="controls-row" style={{ marginTop: 1 }}>
        <Col flex="1">
          <Space>
            {/* 基础参数组件（待开发） */}
            <Button type="text" icon={<span>基础参数</span>} />
            
            {/* 其他参数按钮可以在这里添加 */}
            <Button type="text" icon={<span>5s</span>} />
            <Button type="text" icon={<span>AI音效(关)</span>} />
            <Button type="text" icon={<span>去水印(关)</span>} />
            <Button type="text" icon={<span>AI特效</span>} />
          </Space>
        </Col>
        <Col>
          <Button 
            type="primary" 
            shape="circle" 
            size="large"
            onClick={handleGenerate}
            icon={<span>➤</span>}
          />
        </Col>
      </Row>
      
      {storeError && <div className="error-message">{storeError}</div>}
    </div>
  );
};

export default InputContainer;
