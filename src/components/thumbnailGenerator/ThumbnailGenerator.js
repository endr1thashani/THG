import React, { useState, useRef, useEffect } from 'react';
import './thumbnail.css'
const ThumbnailGenerator = () => {
    const videoRef = useRef(null);
    const [thumbnailURL, setThumbnailURL] = useState('');
    const [thumbnailTime, setThumbnailTime] = useState(0);
    const [videoFile, setVideoFile] = useState(null);
  
    useEffect(() => {
      const storedVideoURL = localStorage.getItem('videoURL');
      const storedThumbnailURL = localStorage.getItem('thumbnailURL');
  
      if (storedVideoURL) {
        setVideoFile(null); 
        setThumbnailURL('');
        videoRef.current.src = storedVideoURL;
      }
  
      if (storedThumbnailURL) {
        setThumbnailURL(storedThumbnailURL);
      }
    }, []);
  
    useEffect(() => {
      if (videoFile) {
        const videoURL = URL.createObjectURL(videoFile);
        localStorage.setItem('videoURL', videoURL);
      } else {
        localStorage.removeItem('videoURL');
      }
    }, [videoFile]);
  
    useEffect(() => {
      if (thumbnailURL) {
        localStorage.setItem('thumbnailURL', thumbnailURL);
      } else {
        localStorage.removeItem('thumbnailURL');
      }
    }, [thumbnailURL]);
  
    const handleVideoChange = (event) => {
      const file = event.target.files[0];
      setVideoFile(file);
      generateThumbnail(file);
    };
  
    const generateRandomTime = (maxTime) => {
      const randomTime = Math.floor(Math.random() * maxTime) + 1;
      return randomTime !== thumbnailTime ? randomTime : generateRandomTime(maxTime);
    };
  
    const generateThumbnail = (video) => {
      const videoURL = URL.createObjectURL(video);
      videoRef.current.src = videoURL;
      setThumbnailURL(''); 
      videoRef.current.onloadedmetadata = () => {
        const maxTime = Math.floor(videoRef.current.duration) - 25;
        const randomTime = generateRandomTime(maxTime);
  
        setThumbnailTime(randomTime);
  
        videoRef.current.currentTime = randomTime;
        videoRef.current.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1920;
          canvas.height = 1080;
  
          const context = canvas.getContext('2d');
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );
  
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            setThumbnailURL(url);
            localStorage.setItem('thumbnailURL', url);
          }, 'image/jpeg', 1);
        };
      };
    };
  
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = thumbnailURL;
      link.download = 'thumbnail.jpg';
      link.click();
    };
  
    const handleGenerateNewThumbnail = () => {
      setThumbnailURL('');
      if (videoFile) {
        generateThumbnail(videoFile);
      }
    };
  return (
    <div className='thumbnail__container'>
      <h1>Thumbnail <span>Generator</span></h1>
      <p>Thumbnail Generator lets you effortlessly customize your thumbnails<br/> to perfection.Watch as your thumbnail comes to life with vibrant colors and stunning graphics. <br/>Say goodbye to tedious design processes and hello to striking thumbnails that will grab<br/> attention and drive engagement.</p>
      <div className='thumbnail__container-file'>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
      </div>
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        controls={false}
      ></video>
      {thumbnailURL && (
        <div>
          <img src={thumbnailURL} alt="Thumbnail" style={{ width: '350px', height: '400px' }} />
          <div className='thumbnail__btn'>
            <button className='thumbnail__btn-generate' onClick={handleGenerateNewThumbnail}>Generate New Thumbnail</button>
            <button className='thumbnail__btn-download' onClick={handleDownload}>Download Thumbnail</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGenerator;
