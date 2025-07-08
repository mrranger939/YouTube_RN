import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@heroui/react";
import { useAuth } from "../Authentication/AuthContext";

export default function LoginComponent() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    try {
      const ipAddress = import.meta.env.VITE_IP_ADD;
      const response = await axios.post(
        `http://${ipAddress}:8000/login`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.message === "success") {
        login(response.data.token);
        navigate("/");
      } else {
        alert("Login failed");
      }
    } catch (e) {
      console.error("error", e);
      alert("An error occurred: ", e);
    }
  };

  return (
    <div className=" bg-white p-8 pb-0">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <div className="mb-4 w-full">
          <Input
            type="email"
            label="Email"
            className="w-full rounded  py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="md"
            variant={"bordered"}
          />
        </div>
        <div className="mb-4 w-full">
          <Input
            type="password"
            label="Password"
            className="w-full rounded py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            size="md"
            variant={"bordered"}
          />
        </div>
        <Button
          type="submit"
          className="px-3 bg-blue-600 text-white py-2 hover:bg-blue-700 "
        >
          Login
        </Button>
      </form>
    </div>
  );
}
