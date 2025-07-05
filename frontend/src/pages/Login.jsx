import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Input} from "@heroui/react";
export default function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("working here", email, password);
  
    const data = { email, password };
  
    try {
      const ipAddress = import.meta.env.VITE_IP_ADD;
      const response = await axios.post(
        `http://${ipAddress}:8000/login`,
        data,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true, 
        }
    );
  
      if (response.data.message === "success") {
        const { message, token } = response.data;

        //localStorage.setItem("authToken", token);
        Cookies.set("authToken", token, { expires: 1 }); 
        navigate("/"); // Redirect to home page
      } else {
        alert("Login failed");
      }
    } catch (e) {
      console.error("error", e);
      alert("An error occurred: ", e);
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
{/*             <label className="block text-sm font-medium mb-2">Email</label> */}

            <Input
              type="email"
              label='Email'
              className="w-full  rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant={"bordered"}
            />

          </div>
          <div className="mb-4">
{/*             <label className="block text-sm font-medium mb-2">Password</label> */}
            <Input
              type="password"
              label="Password"
              className="w-full rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant={"bordered"}
              
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
