import React, { useState, useEffect } from "react";
import "./Cards.css";
import {
  User,
  Card,
  CardFooter,
  Image,
  Button,
  CardBody,
  CardHeader,
  Skeleton
} from "@heroui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ip = import.meta.env.VITE_IP_ADD;

// Helper function to fetch channel details from your API
const fetchChannelDetails = async (channelId) => {
  try {
    const { data } = await axios.get(`http://${ip}:8000/chn/card/${channelId}`);
    console.log("fetched");

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
      return Math.floor(views / 1000000).toFixed(1) + "M"; // Convert to 'k' format
    }
    if (views >= 1000) {
      if (views >= 10000) {
        return Math.floor(views / 1000) + "K"; // Convert to 'k' format
      }
      return (views / 1000).toFixed(1) + "K"; // Convert to 'k' format
    }
    return views.toString(); // Otherwise, just return the views as is
  };

  const formatUploadTime = (uploadTime) => {
    const diff = Math.abs(new Date() - new Date(uploadTime)) / 1000;
    if (diff < 60) {
      var d = Math.floor(diff / 1);
      return d == 1 ? `${d} second ago` : `${d} seconds ago`;
    }
    const minutesAgo = Math.floor(diff / 60);
    if (minutesAgo < 60) {
      return minutesAgo == 1
        ? `${minutesAgo} minute ago`
        : `${minutesAgo} minutes ago`;
    } else if (minutesAgo < 1440) {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return hoursAgo == 1 ? `${hoursAgo} hour ago` : `${hoursAgo} hours ago`;
    } else if (minutesAgo < 10080) {
      const daysAgo = Math.floor(Math.floor(minutesAgo / 60) / 24);
      return daysAgo == 1 ? `${daysAgo} day ago` : `${daysAgo} days ago`;
    } else if (minutesAgo < 43800) {
      const weeksAgo = Math.floor(
        Math.floor(Math.floor(minutesAgo / 60) / 24) / 7
      );
      return weeksAgo == 1 ? `${weeksAgo} week ago` : `${weeksAgo} weeks ago`;
    } else if (minutesAgo < 525600) {
      const monthsAgo = Math.floor(
        Math.floor(Math.floor(Math.floor(minutesAgo / 60) / 24) / 7) / 4
      );
      return monthsAgo == 1
        ? `${monthsAgo} month ago`
        : `${monthsAgo} months ago`;
    } else {
      const yearsAgo = Math.floor(
        Math.floor(
          Math.floor(Math.floor(Math.floor(minutesAgo / 60) / 24) / 7) / 4
        ) / 12
      );
      return yearsAgo == 1 ? `${yearsAgo} year ago` : `${yearsAgo} years ago`;
    }
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
    };

    fetchChannels();
  }, [vid_list, channelDetails]);

  return (
    <div className="youtubern_customcardgrid">
      {vid_list.map((item) => {
        const channel = channelDetails[item.channel_id];
        console.log("In return : ", channel);
        return (
          <Card
            key={item.video_id}
            isFooterBlurred
            shadow="none"
            radius="lg"
            className="youtubern_customcards flex m-2"
            isPressable="true"
            fullWidth="false"
          >
            <CardHeader  onClick={() => n(`/v/${item.video_id}`)}>
              <Image
                alt="Thumbnail"
                className="object-cover youtubern_customcards_img"
                src={`http://${ip}:4566/thumbnail/${item.video_id}.jpg`} // Thumbnail URL
              />
            </CardHeader>
            <CardBody className="flex flex-row">
              <User
                className="items-start mx-1 bg-white"
                onClick={() => n(`/channel/${item.channel_id}`)}
                avatarProps={{
                  src: channel
                    ? channel.logo
                    : "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
                }}
              />
              <div>
                <h3 onClick={() => n(`/v/${item.video_id}`)} className="v-title text-base leading-5 line-clamp-2 text-ellipsis whitespace-normal font-semibold tracking-tight">
                  {item.videoTitle}
                </h3>
                <div
                  className="ch my-1 text-gray-600 text-sm"
                  onClick={() => n(`/channel/${item.channel_id}`)}
                >
                  {channel ? channel.channelName : <Skeleton className="rounded-full w-1/2 h-3" />}{" "}
                  {/* // Display 'Loading...' until the channel details are available */}
                </div>
                <div className="vd my-1 text-gray-600 text-xs">
                  {`${formatViews(item.views)} views • ${formatUploadTime(
                    item.timestamp
                  )}`}
                </div>
              </div>
            </CardBody>
            {/* <CardFooter className="justify-between"></CardFooter> */}
          </Card>
        );
      })}
    </div>
  );
}
