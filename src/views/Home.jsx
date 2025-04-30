import InputContainer from '../components/InputContainer/index';
import { useVideoGenerationStore } from '../store/videoGeneration';
import VideoItem from "../components/VideoItem";
import usePolling from '../hooks/usePolling';
const Home = () => {
  const { aiVideoUrl,taskId } = useVideoGenerationStore();
  const { isPolling, isLoading, error } = usePolling(taskId);
  
  return (
    <div>
     
      <VideoItem AIUrl={aiVideoUrl} taskId={taskId} isPolling={isPolling} isLoading={isLoading} error={error}/>
      <InputContainer />
    </div>
  );
};

export default Home;