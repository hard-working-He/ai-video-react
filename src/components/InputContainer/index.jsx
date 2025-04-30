import { Input, Button } from "antd";
import "./input.css";
import { useVideoGenerationStore } from "../../store/videoGeneration";
import { generateAIVideo } from "../../api/aiVideo";

const InputContainer = () => {
  const { prompt, setPrompt, setTaskId, error: storeError, setError } = useVideoGenerationStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }

    try {
      const taskId = await generateAIVideo(prompt);
      setTaskId(taskId);
      setError(null);
    } catch (err) {
      console.error("生成错误:", err);
      setError("视频生成失败，请重试");
    }
  };

  return (
    <div className="input-container">
      <Input
        onChange={(e) => {
          setPrompt(e.target.value);
          setError(null);
        }}
        value={prompt}
        placeholder="请输入提示词"
      />
      <Button onClick={handleGenerate}>
        生成
      </Button>
      {storeError && <div className="error-message">{storeError}</div>}
    </div>
  );
};

export default InputContainer;
