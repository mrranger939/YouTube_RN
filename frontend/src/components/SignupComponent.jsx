import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
export default function SignupComponent({setShowLogin}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);

    try {
      const ipAddress = import.meta.env.VITE_IP_ADD;
      const response = await axios.post(
        `http://${ipAddress}:8000/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
  };

  if (uploadSuccess) {
    setShowLogin(true)
    return
    // return <Navigate to="/login" />;
  }

  const handleFileChange = async (e) => {
    /* setProfilePic(e.target.files[0]); */
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    if (!file.name.endsWith(".jpg")) {
      alert("Please upload a valid JPG image.");
      return;
    }
    const resizedProfile = await new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const targetWidth = 100;
        const targetHeight = 100;
        const originalWidth = img.width;
        const originalHeight = img.height;

        const scaleFactor = Math.min(
          targetWidth / originalWidth,
          targetHeight / originalHeight
        );
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
    });
    setProfilePic(resizedProfile);
  };

  return (

      <div className="bg-white p-8 pb-0">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center"> 
          <div className="mb-2 w-full">
            <Input
              type="text"
              className="w-full rounded px-3 py-2"
              name="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant={"bordered"}
            />
          </div>
          <div className="mb-2 w-full">
            <Input
              type="email"
              className="w-full rounded px-3 py-2"
              value={email}
              label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              variant={"bordered"}
            />
          </div>
          <div className="mb-2 w-full">
            <Input
              type="password"
              className="w-full rounded px-3 py-2"
              value={password}
              name="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              variant={"bordered"}
            />
          </div>
          <div className="mb-2 w-full">
            {/* <label className="block text-sm font-medium mb-2">
              Profile Picture
            </label> */}
            {/* <Button> */}
            <Input
              type="file"
              className="w-full rounded px-3 py-2"
              name="profilePic"
              label="Profile Picture"
              labelPlacement={'outside'}
              onChange={handleFileChange}
              accept="image/*"
              variant={"bordered"}
            />
            
            {/* </Button> */}
          </div>
          {/*           <div className="mb-4">
            
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
          </div> */}
          <Button
            type="submit"
            className="px-5 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 mx-auto"
          >
            Sign Up
          </Button>
        </form>
      </div>

  );
}
