import { useState, useEffect, useRef } from "react";
import { Skeleton, Button } from "@nextui-org/react";


import axios from "axios";
import Hls from "hls.js";
import { useParams } from "react-router-dom";
import "./Home.css";
// import Plyr from "plyr";
// import "plyr/dist/plyr.css";


import VCards from "../components/VCards";
import SubcrBtn from "../components/SubcrBtn";



const ipAddress = import.meta.env.VITE_IP_ADD;

function Vid({ link }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    console.log("dta recieved : ", link);

    if (link) {
      if (Hls.isSupported()) {
        const hls = new Hls();

        hls.loadSource(link);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS Manifest Parsed");
        });

        // console.log("Video Height in useEffect (intrinsic):",videoRef.current.videoHeight);
        // console.log("Video Height in useEffect (rendered):",videoRef.current.clientHeight);

        hlsRef.current = hls;
      } else {
        videoRef.current.src = link;
      }
    }

    // Cleanup on unmount
    return () => {
      hlsRef.current?.destroy();
    };
  }, [link]);

  return (
    <video
      ref={videoRef} // Attach Plyr and HLS.js to this video element
      // className="w-full max-w-[640px] h-auto max-h-[360px] flex rounded-xl object-contain"
      className="w-full h-auto flex rounded-xl object-contain"
      controls
      onError={(e) => console.error("Error loading video", e)}
      onLoadedData={(e) => {
        console.log("Video Height (intrinsic):", videoRef.current.videoHeight);
        console.log("Video Height (rendered):", videoRef.current.clientHeight);
        console.log("Video loaded successfully", e);
      }}
    >
      {/* No need to add the source here */}
    </video>
  );
}

export default function Video() {
  const { data_id } = useParams();
  const [VD, setVD] = useState(false);
  const [CD, setCD] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Error state

  const fetchChannelData = async (chn) => {
    try {
      const { data } = await axios.get(
        `http://${ipAddress}:8000/chn/vid/${chn}`
      );
      console.log("\n\n CD : ", data); // Log the video data
      setCD(data);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const { data } = await axios.get(
          `http://${ipAddress}:8000/v/${data_id}`
        );
        console.log("\n\n VD : ", data); // Log the video data
        setVD(data);
        setLoading(false); // Set loading to false once data is fetched
        if (data) {
          console.log("inside IF", VD.data);
          fetchChannelData(data.data.channel_id);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
        setError(true);
        setLoading(false);
      }
    };

    // Run fetchVideoData when component mounts (similar to componentDidMount)
    fetchVideoData();
  }, [data_id]); // Dependency array ensures it runs when data_id changes

  // Conditional rendering based on loading, error, and video data states
  if (loading) {
    // Show loading skeleton while video data is being fetched
    return <></>;
  }

  if (error) {
    // Show 404 page if there's an error fetching the video data
    return (
      <div className="error-page">
        <h1>404 - Video Not Found</h1>
        <p>The video you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="mt-1 mx-8"
        style={{ display: "grid", gridTemplateColumns: "70% 30%" }}
      >
        <div
          className="video mx-2 flex flex-col"
          // style={{ display: "grid", gridTemplateRows: `${Gr} auto auto` }}
        >
          {/* <div className="w-full max-w-[640px] h-auto max-h-[360px] flex rounded-xl mx-2 object-contain justify-center items-baseline"> */}
          <div
            className={
              "w-full h-auto flex rounded-xl mb-2 object-contain justify-center items-baseline"
            }
          >
            <Vid link={VD.link} />
          </div>

          <div className="video-details bg-light mx-1 rounded-xl">
            <h1
              className="v-title font-bold tracking-tight"
              style={{ fontSize: "20px" }}
            >
              {VD.data.title ? (
                VD.data.title
              ) : (
                <>
                  <Skeleton className="w-full h-3 rounded-xl my-3" />
                  <Skeleton className="w-1/2 h-3 rounded-xl mb-3" />
                </>
              )}
            </h1>

            <div className="video-actions items-center flex flex-row mt-2">
              <div className="rounded-full flex-none w-10 h-10 content-center">
                {CD ? (
                  <img
                    src={CD.logo}
                    className="rounded-full w-10 h-10"
                    alt="channel_logo"
                  />
                ) : (
                  // <img src={CD.logo}  className="flex rounded-full" />
                  <Skeleton className="rounded-full w-10 h-10" />
                )}
              </div>
              <div>
                <div className="mx-2 w-32 flex flex-col">
                  {CD ? (
                    <>
                      <p className="w-full font-semibold tracking-tight text-base">
                        {CD.channelName}
                      </p>
                      <p className=" w-full text-xs ease-in-out duration-500 text-gray-400">
                        17{CD.subscribers}K subscribers
                      </p>
                    </>
                  ) : (
                    <>
                      <Skeleton className="h-3 w-4/5 my-1 rounded-xl" />
                      <Skeleton className="h-3 w-3/5 my-1 rounded-xl" />
                    </>
                  )}
                </div>
              </div>

              <div className="subscribe mr-4">
                <SubcrBtn />
              </div>
              <div className="">
                <Button
                  isIconOnly
                  className="m-1"
                  variant="ghost"
                  color="danger"
                  aria-label="Like"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0501 7.04419C15.4673 5.79254 14.5357 4.5 13.2163 4.5C12.5921 4.5 12.0062 4.80147 11.6434 5.30944L8.47155 9.75H5.85748L5.10748 10.5V18L5.85748 18.75H16.8211L19.1247 14.1428C19.8088 12.7747 19.5406 11.1224 18.4591 10.0408C17.7926 9.37439 16.8888 9 15.9463 9H14.3981L15.0501 7.04419ZM9.60751 10.7404L12.864 6.1813C12.9453 6.06753 13.0765 6 13.2163 6C13.5118 6 13.7205 6.28951 13.627 6.56984L12.317 10.5H15.9463C16.491 10.5 17.0133 10.7164 17.3984 11.1015C18.0235 11.7265 18.1784 12.6814 17.7831 13.472L15.8941 17.25H9.60751V10.7404ZM8.10751 17.25H6.60748V11.25H8.10751V17.25Z"
                        fill="#080341"
                      ></path>{" "}
                    </g>
                  </svg>
                </Button>

                <Button
                  isIconOnly
                  className="m-1"
                  variant="ghost"
                  color="warning"
                  aria-label="Like"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0501 16.9558C15.4673 18.2075 14.5357 19.5 13.2164 19.5C12.5921 19.5 12.0063 19.1985 11.6435 18.6906L8.47164 14.25L5.85761 14.25L5.10761 13.5L5.10761 6L5.85761 5.25L16.8211 5.25L19.1247 9.85722C19.8088 11.2253 19.5407 12.8776 18.4591 13.9592C17.7927 14.6256 16.8888 15 15.9463 15L14.3982 15L15.0501 16.9558ZM9.60761 13.2596L12.8641 17.8187C12.9453 17.9325 13.0765 18 13.2164 18C13.5119 18 13.7205 17.7105 13.6271 17.4302L12.317 13.5L15.9463 13.5C16.491 13.5 17.0133 13.2836 17.3984 12.8985C18.0235 12.2735 18.1784 11.3186 17.7831 10.528L15.8941 6.75L9.60761 6.75L9.60761 13.2596ZM8.10761 6.75L6.60761 6.75L6.60761 12.75L8.10761 12.75L8.10761 6.75Z"
                        fill="#080341"
                      ></path>{" "}
                    </g>
                  </svg>
                </Button>

                <Button
                  isIconOnly
                  className="m-1"
                  variant="ghost"
                  color="primary"
                  aria-label="Like"
                >
                  <svg
                    viewBox="0 -0.5 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.734 15.8974L19.22 12.1374C19.3971 11.9927 19.4998 11.7761 19.4998 11.5474C19.4998 11.3187 19.3971 11.1022 19.22 10.9574L14.734 7.19743C14.4947 6.9929 14.1598 6.94275 13.8711 7.06826C13.5824 7.19377 13.3906 7.47295 13.377 7.78743V9.27043C7.079 8.17943 5.5 13.8154 5.5 16.9974C6.961 14.5734 10.747 10.1794 13.377 13.8154V15.3024C13.3888 15.6178 13.5799 15.8987 13.8689 16.0254C14.158 16.1521 14.494 16.1024 14.734 15.8974Z"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          <div className="discription bg-gray-400 flex-none h-64 mt-3 rounded-xl"></div>
        </div>

        <div
          // className="cards bg-gray-400 ml-5 rounded-xl"
          className="cards ml-5 rounded-xl"
          style={{ height: "100vh" }}
        >
          {CD?
          <VCards Vdata={VD.data} Cdata={CD} />:<></>
        }
        </div>
      </div>
    </>
  );
}
