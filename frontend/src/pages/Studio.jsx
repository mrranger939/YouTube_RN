import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Home.css";
import "./Studio.css";
import { Spinner } from "@nextui-org/spinner";
import { Textarea } from "@nextui-org/react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
export const genres = [
  { label: "Gaming", key: "gaming" },
  { label: "Education", key: "education" },
  { label: "Music", key: "music" },
  { label: "Comedy", key: "comedy" },
  { label: "Vlogs", key: "vlogs" },
  { label: "Tech", key: "tech" },
  { label: "Fitness", key: "fitness" },
  { label: "Food", key: "food" },
  { label: "Travel", key: "travel" },
  { label: "Lifestyle", key: "lifestyle" },
  { label: "DIY", key: "diy" },
  { label: "Beauty", key: "beauty" },
  { label: "Movies", key: "movies" },
  { label: "Movie Reviews", key: "movie_reviews" },
  { label: "ASMR", key: "asmr" },
  { label: "Podcasts", key: "podcasts" },
  { label: "Finance", key: "finance" },
  { label: "Science", key: "science" },
  { label: "Sports", key: "sports" },
  { label: "Motivation", key: "motivation" },
];

export const videoType = [
  { key: "video", label: "Video" },
  { key: "short", label: "Short" },
];

export default function Upload() {
  const navigate = useNavigate();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [ifchannel, setIfChannel] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectShort, setSelectShort] = useState("");

  useEffect(() => {
    const if_channel = async () => {
      const token = Cookies.get("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        const ipAddress = import.meta.env.VITE_IP_ADD;
        const response = await axios.get(
          `http://${ipAddress}:8000/checkifchannel/${decoded.user_id}`
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
    formData.append("genre", selectedGenre);
    formData.append("short", selectShort);
    const imageFile = formData.get("image");
    const videoFile = formData.get("video");

    if (!imageFile.name.endsWith(".jpg")) {
      alert("Please upload a valid JPG image.");
      return;
    }

    if (!videoFile.name.endsWith(".mp4")) {
      alert("Please upload a valid MP4 video.");
      return;
    }
    try {
      const ipAddress = import.meta.env.VITE_IP_ADD;
      const response = await axios.post(
        `http://${ipAddress}:8000/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data === "success") {
        setUploadSuccess(true);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred : " + error);
    }
  };
  if (uploadSuccess) {
    return <Navigate to="/" />;
  }

  return ifchannel ? (
    <div className="uploaddata">
      <h1>Upload your Video</h1>
      <form
        id="uploadform"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
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
  ) : (
    <Spinner />
  );
}
