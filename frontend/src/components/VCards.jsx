import { useEffect, useState, useRef } from "react";
import { Skeleton, Spinner } from "@heroui/react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatViews, formatDuration, formatUploadTime } from "../utils/formatter";
import { API_BASE_URL } from "../config/api";

// Helper function to fetch channel details from your API
const fetchChannelDetails = async (channelId) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/chn/card/${channelId}`);
    console.log("fetched");
    return data;
  } catch (error) {
    console.error("Error fetching video data:", error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};



/*
* VCards Component
*
* Renders a list of video cards fetched from the API.
*
* `@param` {Object} Vdata  - Reserved for future use: metadata about the currently
*                          playing video (title, tags, category, etc.) that will
*                          be used to power personalised / related-video
*                          recommendations based on the video and channel being
*                          watched.
* `@param` {Object} Cdata  - Channel data used to trigger a fresh fetch of the
*                          video list whenever the active channel changes.
*/

// Video Cards for Recommendations IG
export default function VCards({ Vdata, Cdata }) {
  const n = useNavigate();
  const [vidList, setVidList] = useState(null);
  const [channelDetails, setChannelDetails] = useState({});
  const [errorf, setErrorf] = useState(null); //Error Flag contains Error


  // TODO: use Vdata to fetch recommended/related videos once recommendation logic is implemented
  console.log("VCards props — Vdata (future recommendations):", Vdata, "| Cdata:", Cdata);




  // Fetching Video List
  useEffect(() => {
    const fetchVidList = async () => {
      try {
        const { data } = await axios.get(
          `http://${ipAddress}:8000/list/videos/cards`
        );
        setVidList(data.data); // Assuming response data is the list of videos
        console.log("Vide0-list :");
        console.log(data.data);
        setErrorf(null); // Set errorf if there is any//testing purposes


      } catch (err) {
        setErrorf({
          message: err?.message || "Failed to fetch videos",
          raw: err,
        }); // Set errorf if there is any //testing purposes
      }
    };

    fetchVidList();
  }, []);



  // Fetch channel details in parallel after cards are rendered
  const inFlightChannels = useRef(new Set());

  useEffect(() => {
    if (!vidList) return;

    const missing = [...new Set(vidList.map(v => v.channel_id))]
      .filter(
        id =>
          !channelDetails[id] &&
          !inFlightChannels.current.has(id)
      );

    missing.forEach((id) => {
      inFlightChannels.current.add(id);

      fetchChannelDetails(id)
        .then((data) => {
          if (!data) return;

          setChannelDetails((prev) => ({
            ...prev,
            [id]: data,
          }));
        })
        .catch((err) => {
          console.error("Error fetching channel details:", err);
        })
        .finally(() => {
          inFlightChannels.current.delete(id);
        });
    });
  }, [vidList, channelDetails]);


  if (errorf) {
    console.log(errorf)
    console.log(errorf.raw || errorf);
    return (
      <div className="rounded-xl m-2 justify-items-center h-full items-center text-center ">
        <div className="flex w-auto  text-center  h-full">
          <Spinner color="danger" size="lg" label={errorf.message} />
        </div>
      </div>)
  }


  return (
    <>

      {vidList ?

        (
          <div className="rounded-xl m-2 ">
            {
              vidList.map((item) => {
                const channel = channelDetails[item.channel_id];
                // console.log("In return : ", channel,item);//testing purposes
                return (

                  <div onClick={() => n(`/v/${item.video_id}`)} className="rounded-xl mb-4 flex flex-row items-start" key={item.video_id}>
                    <div className="w-full">
                      <img src={`http://${ipAddress}:4566/thumbnail/${item.video_id}.jpg`} className="rounded-xl w-full" alt={item.videoTitle ? `Thumbnail for ${item.videoTitle}` : "Video thumbnail"} />
                    </div>

                    <div className="video-details bg-light mx-2 w-full rounded-xl ">
                      <h3 className="v-title text-base leading-5 line-clamp-2 text-ellipsis whitespace-normal font-medium tracking-tight">
                        {item.videoTitle ? (
                          item.videoTitle
                        ) : (
                          <>
                            <Skeleton className="w-full h-3 rounded-xl my-3" />
                            <Skeleton className="w-1/2 h-3 rounded-xl mb-3" />
                          </>
                        )}
                      </h3>
                      <div className="ch my-1 text-gray-600 text-sm" style={{ backgroundColor: "cyan" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          n(`/channel/${item.channel_id}`);
                        }}>
                        {channel ? (
                          channel.channelName
                        ) : (
                          // <img src={CD.logo}  className="flex rounded-full" />
                          <Skeleton className="rounded-full w-full h-2" />
                        )}
                      </div>
                      <div className="vd my-1 text-gray-600 text-xs">
                        {vidList ? (
                          `${formatViews(item.views)} views • ${formatUploadTime(item.timestamp)}`
                        ) : (
                          // <img src={CD.logo}  className="flex rounded-full" />
                          <>
                            <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                            <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                );
              })}

          </div>
        ) : (
          <div className="rounded-xl m-2 justify-items-center h-full items-center text-center ">
            <div className="flex w-auto  text-center  h-full">
              {/* <Spinner color="warning" size="lg" label="Error..." />
              <p>Failed to load videos. Please try again.</p> */}
              <Spinner color="warning" size="lg" label="Loading..." />
            </div>
          </div>
        )}
    </>
  );
}