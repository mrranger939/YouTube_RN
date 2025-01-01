import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";
import './Home.css';
import './Studio.css';

export default function Upload() {

  const [uploadSuccess, setUploadSuccess] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // UpDATE YOUR IP ADDRESS BEFORE RUNNING

    try {
      const ipAddress = import.meta.env.VITE_IP_ADD;
      const response = await axios.post(`http://${ipAddress}:8000/upload`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`,
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

  );
}
