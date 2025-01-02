import React, { useState, useEffect } from "react";
import "./Cards.css";
import {
  User,
  Card,
  CardFooter,
  Image,
  Button,
  CardHeader,
} from "@nextui-org/react";
import { Navigate, useNavigate } from "react-router-dom";


export default function Cards({ vid_list }) {

    const n = useNavigate();

  // Helper function to format views, duration, and upload time
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M'; // Convert to 'k' format
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K'; // Convert to 'k' format
    }
    return views.toString(); // Otherwise, just return the views as is
  };

  const formatUploadTime = (uploadTime) => {
    const diff = Math.abs(new Date() - new Date(uploadTime)) / 1000;
    const minutesAgo = Math.floor(diff / 60);
    return `${minutesAgo} minutes ago`;
  };

  const ip = import.meta.env.VITE_IP_ADD;

  return (
    <div className="youtubern_customcardgrid">
      {vid_list.map((item) => (
        <Card
          key={item.video_id}
          isFooterBlurred
          radius="lg"
          className="youtubern_customcards flex m-2"
          isPressable="true"
          fullWidth="false"
          onPress={()=>{n(`/v/${item.video_id}`)}}
        >
          <CardHeader>
            <Image
              alt="Thumbnail"
              className="object-cover youtubern_customcards_img"
              src={`http://${ip}:4566/thumbnail/${item.video_id}.jpg`} // You can customize this as per your data
              height={999}
              width={999}
            />
          </CardHeader>

          <CardFooter className="justify-between">
            <User
              name={item.channel_id}
              description={`${formatViews(
                item.views
              )} views • ${formatUploadTime(item.timestamp)}`}
              avatarProps={{
                src: "nawphot", // Customize this as per your data
              }}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
