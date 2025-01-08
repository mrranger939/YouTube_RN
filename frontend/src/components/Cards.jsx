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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ip = import.meta.env.VITE_IP_ADD;

// Helper function to fetch channel details from your API
const fetchChannelDetails = async (channelId) => {
  try {
    const { data } = await axios.get(`http://${ip}:8000/chn/card/${channelId}`);
    
    return data;
  } catch (error) {
    console.error("Error fetching video data:", error);
  }
};

export default function Cards({ vid_list }) {
  const n = useNavigate();
  const [channelDetails, setChannelDetails] = useState({});

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
      return (views / 1000000).toFixed(1) + "M"; // Convert to 'k' format
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K"; // Convert to 'k' format
    }
    return views.toString(); // Otherwise, just return the views as is
  };

  const formatUploadTime = (uploadTime) => {
    const diff = Math.abs(new Date() - new Date(uploadTime)) / 1000;
    const minutesAgo = Math.floor(diff / 60);
    return `${minutesAgo} minutes ago`;
  };


  useEffect(() => {
    // Fetch channel details in parallel after cards are rendered
    const fetchChannels = () => {
      vid_list.forEach((item) => {
        if (!channelDetails[item.channel_id]) {
          fetchChannelDetails(item.channel_id)
            .then((data) => {
              setChannelDetails((prev) => ({
                ...prev,
                [item.channel_id]: data,
              }));
            })
            .catch((err) => {
              console.error("Error fetching channel details:", err);
            });
        }
      });
      console.log("In useEffect : ",typeof channelDetails);
      console.log("In useEffect : ",channelDetails);
    };

    fetchChannels();
  }, [vid_list, channelDetails]);

  return (
    <div className="youtubern_customcardgrid">
      {vid_list.map((item) => {
        const channel = channelDetails[item.channel_id];
        console.log("In return : ",channel)
        return (
          <Card
            key={item.video_id}
            isFooterBlurred
            radius="lg"
            className="youtubern_customcards flex m-2"
            isPressable="true"
            fullWidth="false"
            onPress={() => n(`/v/${item.video_id}`)}
          >
            <CardHeader>
              <Image
                alt="Thumbnail"
                className="object-cover youtubern_customcards_img"
                src={`http://${ip}:4566/thumbnail/${item.video_id}.jpg`} // Thumbnail URL
                height={999}
                width={999}
              />
            </CardHeader>

            <CardFooter className="justify-between">
              <User
                name={channel ? channel.channelName : "Loading..."} // Display 'Loading...' until the channel details are available
                description={`${formatViews(
                  item.views
                )} views • ${formatUploadTime(item.timestamp)}`}
                avatarProps={{
                  src: channel
                    // ? `http://${ip}:4566/profile/${channel.logo}`
                    ? channel.logo
                    : "loading-logo.jpg", // Default loading logo
                }}
              />
            </CardFooter>
          </Card>
        );

        // <Card
        //   key={item.video_id}
        //   isFooterBlurred
        //   radius="lg"
        //   className="youtubern_customcards flex m-2"
        //   isPressable="true"
        //   fullWidth="false"
        //   onPress={()=>{n(`/v/${item.video_id}`)}}
        // >
        //   <CardHeader>
        //     <Image
        //       alt="Thumbnail"
        //       className="object-cover youtubern_customcards_img"
        //       src={`http://${ip}:4566/thumbnail/${item.video_id}.jpg`} // You can customize this as per your data
        //       height={999}
        //       width={999}
        //     />
        //   </CardHeader>

        //   <CardFooter className="justify-between">
        //     <User
        //       name={item.channel_id}
        //       description={`${formatViews(
        //         item.views
        //       )} views • ${formatUploadTime(item.timestamp)}`}
        //       avatarProps={{
        //         src: "nawphot", // Customize this as per your data
        //       }}
        //     />
        //   </CardFooter>
        // </Card>
      })}
    </div>
  );
}
