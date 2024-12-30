import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import './Home.css';
import './Studio.css';

export default function Upload() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // UpDATE YOUR IP ADDRESS BEFORE RUNNING

    try {
      const response = await axios.post('http://192.168.1.3:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data === 'success') {
        setUploadSuccess(true); // Set success state to trigger navigation
      } else {
        alert('Upload failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred : '+error);
    }
  };

  // Redirect to home page after successful upload
  if (uploadSuccess) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      <div className="flex mt-7">
        <Sidebar sidebarOpen={sidebarOpen} />
        <div
          id="content"
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'} w-full pt-12`}
        >
          <div className="uploaddata">
            <h1>Upload your Thumbnail and Video</h1>
            <form id="uploadform" onSubmit={handleSubmit} encType="multipart/form-data">
              <label htmlFor="image">Choose an image to upload:</label>
              <input type="file" id="image" name="image" required />
              <label htmlFor="video">Choose a video to upload:</label>
              <input type="file" id="video" name="video" required />
              <input type="submit" value="Upload Image and Video" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
