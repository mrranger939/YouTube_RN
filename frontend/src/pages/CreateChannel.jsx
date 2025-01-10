import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import {Spinner} from "@nextui-org/spinner";
export default function CreateChannel() {
    const navigate = useNavigate()
  const [description, setDescription] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelBanner, setChannelBanner] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [ifchannel, setIfChannel] = useState(false)
  useEffect(()=>{

    const if_channel = async ()=>{
      const token = Cookies.get("authToken")
      if(token){
        const decoded = jwtDecode(token);
        const ipAddress = import.meta.env.VITE_IP_ADD;
        const response = await axios.get(`http://${ipAddress}:8000/checkifchannel/${decoded.user_id}`);
        try {
          if (response.data === 'success') {
            setIfChannel(true);
            navigate(`/channel/${decoded.user_id}`)
          } 
          else {
            console.error("Unexpected response received:", response.data);
          }
        } catch (error) {
          console.error("Error occurred while checking channel status:", error);
        }
      } else {
        navigate("/login")
      }
    }
    if_channel()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken")
    if(token){
        const decodedData = jwtDecode(token);
        const formData = new FormData();
        formData.append("channelName", channelName);
        formData.append("description", description);
        formData.append("channelBanner", channelBanner);
        formData.append("usedId", decodedData.user_id)
    
        try {
          const ipAddress = import.meta.env.VITE_IP_ADD;
          const response = await axios.post(
            `http://${ipAddress}:8000/createChannel`,
            formData,
            {
            headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
            'Content-Type': 'multipart/form-data',
            },
            }
          );
    
          console.log("Response", response.data);
          if (response.data.message === "success") {
            setUploadSuccess(true);
          } else {
            alert("Upload Fail");
          }
        } catch (error) {
          console.error("Error: ", error);
          alert("An error occurred: ", error);
        }
    } else{
        alert("please Login");
        navigate("/login");
    }
  };

  if (uploadSuccess) {
    return <Navigate to="/" />;
  }

  const handleFileChange = async (e) => {
    /* setChannelBanner(e.target.files[0]); */
    const file = e.target.files[0];
    if(!file){ return; }
    if (!file.name.endsWith(".jpg")) {
      alert("Please upload a valid JPG image.");
      return;
    }
    const resizedBanner = await new Promise((resolve)=>{
      const img = new Image()
      img.src = URL.createObjectURL(file);
      img.onload = () =>{
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const targetWidth = 1060;
        const targetHeight = 175;
        const originalWidth = img.width;
        const originalHeight = img.height;

        const scaleFactor = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);
        const newWidth = originalWidth * scaleFactor;
        const newHeight = originalHeight * scaleFactor;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(
          img,
          (targetWidth - newWidth) / 2,
          (targetHeight - newHeight) / 2,
          newWidth,
          newHeight
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob); 
            }
          },
          "image/jpeg",
          0.9
        );
      };
        
    })
    setChannelBanner(resizedBanner)
  };

  return (
    (  ifchannel ? <Spinner/> :

    (<div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Channel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              className="w-full rounded px-3 py-2"
              value={channelName}
              name="channelName"
              label="Channel Name"
              onChange={(e) => setChannelName(e.target.value)}
              required
              variant={"underlined"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Channel Banner
            </label>
            <input
              type="file"
              className="w-full"
              name="channelBanner"
              accept=".jpg"
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-4">
            <Textarea
              className="max-w-xs"
              name="description"
              value={description}
              variant="underlined"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              label="Description"
              placeholder="Enter your Channel description"
              required
            />

            {/*             <Input
              type="text"
              className="w-full rounded px-3 py-2"
              name="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant={"underlined"}
            /> */}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>)
    )
    )
}
