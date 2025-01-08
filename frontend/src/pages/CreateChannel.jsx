import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
export default function CreateChannel() {
    const navigate = useNavigate()
  // const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  //  const [password, setPassword] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelBanner, setChannelBanner] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken")
    if(token){
        const decodedData = jwtDecode(token);

        // console.log("Creating account:", { username, email, password, channelName, profilePic });
        const formData = new FormData();
        formData.append("channelName", channelName);
        formData.append("description", description);
        // formData.append("password", password);
        // formData.append("channelName", channelName);
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

  const handleFileChange = (e) => {
    setChannelBanner(e.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Channel</h2>
        <form onSubmit={handleSubmit}>
          {/*<div className="mb-4">
            <Input
              type="text"
              className="w-full rounded px-3 py-2"
              name="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant={"underlined"}
            />
          </div> */}
          {/*           <div className="mb-4">
            <Input
              type="email"
              className="w-full rounded px-3 py-2"
              value={email}
              label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              variant={"underlined"}
            />
          </div> */}
          {/*           <div className="mb-4">
            <Input
              type="password"
              className="w-full rounded px-3 py-2"
              value={password}
              name="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              variant={"underlined"}
            />
          </div> */}
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
              onChange={handleFileChange}
              accept="image/*"
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
    </div>
  );
}