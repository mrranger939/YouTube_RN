import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import {Input} from "@nextui-org/react";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
/*   const [channelName, setChannelName] = useState(""); */
  const [profilePic, setProfilePic] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Creating account:", { username, email, password, channelName, profilePic });
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
/*     formData.append("channelName", channelName); */
    formData.append("profilePic", profilePic);

    try{
        const ipAddress = import.meta.env.VITE_IP_ADD;
        const response = await axios.post(`http://${ipAddress}:8000/signup`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Response", response.data);
        if(response.data.message === 'success'){
            setUploadSuccess(true);
        } else {
            alert("Upload Fail")
        }

    } catch (error) {
        console.error("Error: ", error);
        alert("An error occurred: ", error)
    }
  };

  if(uploadSuccess){
    return <Navigate to="/login"/>
  }

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
{/*             <label className="block text-sm font-medium mb-2">Username</label> */}
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
          </div>
          <div className="mb-4">
   {/*          <label className="block text-sm font-medium mb-2">Email</label> */}
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
          </div>
          <div className="mb-4">
            {/* <label className="block text-sm font-medium mb-2">Password</label> */}
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
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              className="w-full"
              name="profilePic"
              onChange={handleFileChange}
              accept="image/*"
            />
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
