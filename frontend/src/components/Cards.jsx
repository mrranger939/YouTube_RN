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
import {
  formatViews,
  formatUploadTime,
} from "../utils/formatter";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";


// Helper function to fetch channel details from your API
const fetchChannelDetails = async (channelId) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/chn/card/${channelId}`);
    console.log("fetched all channel details for card rendering");
    return data;
  } catch (error) {
    console.error("Error fetching video data:", error);
  }
};

export default function Cards({ vid_list }) {
  const n = useNavigate();
  const [channelDetails, setChannelDetails] = useState({});



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
