import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Home.css";
import "./Studio.css";
import { Spinner } from "@heroui/spinner";
import { Textarea } from "@heroui/react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { resizeImage } from "../utils/imageUtils";
import { genres } from "../Data/VideoGenre";
import { videoType } from "../Data/VideoType";
import { API_BASE_URL } from "../config/api";

export default function Upload() {
  const navigate = useNavigate();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [ifchannel, setIfChannel] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectShort, setSelectShort] = useState("");
  const [resizedImage, setResizedImage] = useState(null);
  useEffect(() => {
    const if_channel = async () => {
      const token = Cookies.get("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `${API_BASE_URL}/checkifchannel/${decoded.user_id}`,
        );
        try {
          if (response.data === "success") {
            setIfChannel(true);
          } else if (response.data === "fail") {
            navigate("/createChannel");
          } else {
            console.error("Unexpected response received:", response.data);
          }
        } catch (error) {
          console.error("Error occurred while checking channel status:", error);
        }
      } else {
        navigate("/login");
      }
    };
    if_channel();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const imageFile = formData.get("image");
    const videoFile = formData.get("video");

    // Validate file extensions
    if (!imageFile.name.endsWith(".jpg")) {
      alert("Please upload a valid JPG image.");
      return;
    }

    if (!videoFile.name.endsWith(".mp4")) {
      alert("Please upload a valid MP4 video.");
      return;
    }

    const resizedImageBlob = await resizeImage(imageFile, 720, 404);

    const newFormData = new FormData();
    newFormData.append("genre", selectedGenre);
    newFormData.append("short", selectShort);
    newFormData.append("video", videoFile);
    newFormData.append("videoTitle", formData.get("videoTitle"));
    newFormData.append("description", formData.get("description"));
    newFormData.append("resizedImage", resizedImageBlob, "resized-image.jpg");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        newFormData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data === "success") {
        setUploadSuccess(true);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    }
  };

  if (uploadSuccess) {
    return <Navigate to="/" />;
  }
  if (!ifchannel) return <Spinner />;

  return (
    <div className="uploaddata">
      <h1 className="font-bold text-xl mb-2">Upload your Video</h1>
      <form
        id="uploadform"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="text-sm"
      >
        <label htmlFor="image">Choose an image to upload:</label>
        <input type="file" id="image" name="image" accept=".jpg" required />
        <label htmlFor="video">Choose a video to upload:</label>
        <input type="file" id="video" name="video" accept=".mp4" required />
        <div className="mb-4">
          <Textarea
            className="max-w-xs"
            name="videoTitle"
            id="videoTitle"
            variant="underlined"
            label="Video Title"
            placeholder="Enter your video title"
            required
          />
        </div>
        <div className="mb-4">
          <Textarea
            className="max-w-xs"
            name="description"
            id="description"
            variant="underlined"
            label="Description"
            placeholder="Enter your Channel description"
            required
          />
        </div>
        <Autocomplete
          className="max-w-xs"
          label="Select the video's genre"
          onSelectionChange={(value) => {
            setSelectedGenre(value);
            console.log("Genre selected: ", value);
          }}
        >
          {genres.map((item) => (
            <AutocompleteItem key={item.key} value={item.key}>
              {item.label}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Select
          className="max-w-xs"
          label="Select if video or short"
          value={selectShort}
          onChange={(e) => setSelectShort(e.target.value)}
        >
          {videoType.map((item) => (
            <SelectItem key={item.key} value={item.key}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <input type="submit" value="Upload Image and Video" />
      </form>
    </div>
  );
}
