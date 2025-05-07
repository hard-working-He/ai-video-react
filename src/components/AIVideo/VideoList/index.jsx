/*urlList [
    {
        "id": 1,
        "file_path": "\"https://aigc-files.bigmodel.cn/api/cogvideo/3fd7dc12-24f2-11f0-9198-fef226b85e0b_0.mp4\"",
        "creation_params": "{}",
        "created_at": "0001-01-01T00:00:00Z"
    },
    {
        "id": 2,
        "file_path": "\"https://aigc-files.bigmodel.cn/api/cogvideo/3fd7dc12-24f2-11f0-9198-fef226b85e0b_0.mp4\"",
        "creation_params": "{}",
        "created_at": "0001-01-01T00:00:00Z"
    }
] */
import VideoItem from '../VideoItem';
import './videoList.css';


export const VideoList = ({ urlList }) => {
  console.log(urlList);
  return (
    <div className="video-list-container">
      {urlList && urlList.length > 0 ? (
        urlList.map((item) => (
          <VideoItem 
            status={item.status}
            key={item.id} 
            videoUrl={item.file_path}
            creation_params={item.creation_params}
          />
        ))
      ) : (
        <div>没有视频</div>
      )}
    </div>
  );    
};

export default VideoList;
