import React, { useState, useRef, useEffect } from 'react';
import './pickVideo.css';

const PickVideo = ({ croppedFile, onUploaded, onRagConfig, onRemoveIllegal, onChangeStatus, onUpdateWordCount, onDrop: onDropProp }) => {
  // State
  const [dragOver, setDragOver] = useState(false);
  const [image, setImage] = useState('');
  const [ratio, setRatio] = useState(1);
  
  // Refs
  const fileInput = useRef(null);
  const dragTimer = useRef(null);
  
  // 移除未实现的 useCogvideoInput hook
  const preview = image; // 简化为只使用本地 image 状态
  
  // Watch effect for croppedFile changes
  useEffect(() => {
    if (!croppedFile) return;
    
    // Check if croppedFile is a valid Blob or File object
    if (!(croppedFile instanceof Blob || croppedFile instanceof File)) {
      console.error('croppedFile is not a valid Blob or File object:', croppedFile);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(croppedFile);
    
    reader.onload = (e) => {
      setImage(e.target.result);
      const imageObj = new Image();
      imageObj.src = e.target.result;
      
      imageObj.onload = function() {
        setRatio(imageObj.width / imageObj.height);
        console.log('img2video-ratio', imageObj.width / imageObj.height);
      };
    };
  }, [croppedFile]);
  
  // Event handlers
  const handlePickFile = () => {
    fileInput.current.click();
  };
  
  const fileChanged = (event) => {
    const file = event.target.files[0];
    uploader(file);
    event.target.value = '';
  };
  
  const uploader = (file) => {
    // Check if file is a valid File object
    if (!(file instanceof File)) {
      console.error('Invalid file object:', file);
      return;
    }
    
    const extension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'tiff', 'webp', 'svg'];
    
    if (!allowedExtensions.includes(extension)) {
      // 移除未实现的 _zpmessage
      alert('不支持该格式文件，请尝试其他格式');
      return;
    }
    
    const isLt15M = file.size / 1024 / 1024 <= 15;
    
    if (!isLt15M) {
      alert('图片大小不能超过15MB');
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = function(evt) {
      const replaceSrc = evt.target.result;
      const imageObj = new Image();
      imageObj.src = replaceSrc;
      
      imageObj.onload = function() {
        if (Math.min(imageObj.width, imageObj.height) < 300) {
          alert('上传失败（图片最短边不能小于300像素）');
          return;
        }
        const imgRatio = imageObj.width / imageObj.height;
        onUploaded(file, imgRatio);
      };
    };
  };
  
  const onDragover = (e) => {
    e.preventDefault();
    clearTimeout(dragTimer.current);
    setDragOver(true);
  };
  
  const onDragleave = (e) => {
    e.preventDefault();
    dragTimer.current = setTimeout(() => {
      setDragOver(false);
    }, 100);
  };
  
  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    uploader(file);
    
    setDragOver(false);
    if (onDropProp) onDropProp(file);
  };
  
  const deleteImage = () => {
    setImage('');
    onUploaded(null, null);
  };
  
  // Expose functions (using forwardRef would be needed if required by parent)
  
  return (
    <div
      className="panel"
      onDragOver={onDragover}
      onDragLeave={onDragleave}
      onDrop={onDrop}
      onClick={handlePickFile}
    >
      {!preview ? (
        <div
          className={`uploader ${dragOver && !preview ? 'drag_hover' : ''}`}
        >
          {/* 移除未实现的组件 */}
          <div className={`size-20 upload-icon`}>上传图片</div>
        </div>
      ) : (
        <div className="preview-box" onClick={(e) => e.stopPropagation()}>
          <img
            className={`preview ${ratio === 1.328 ? 'preview-long' : ''}`}
            src={image}
            alt=""
          />
          <div className="delete-box" onClick={(e) => { e.stopPropagation(); deleteImage(); }}>
            {/* 移除未实现的组件 */}
            <span className="close-btn">×</span>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInput}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={fileChanged}
      />
    </div>
  );
};

export default PickVideo;
