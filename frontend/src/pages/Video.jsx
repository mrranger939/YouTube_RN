import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import axios from "axios";
import { useParams } from 'react-router-dom';
import './Home.css'
export default function Video() {
    const { data_id } = useParams();
    console.log(data_id)
    const [videoSrc, setVideoSrc] = useState('');
    const [posterSrc, setPosterSrc] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/api/get-video-data`, { data_id });
                const { videoSrc, posterSrc } = response.data;
                setVideoSrc(`http://localhost:8000/video/${videoSrc}`);
                setPosterSrc(`http://localhost:8000/video/${posterSrc}`);
            } catch (error) {
                console.error("Error fetching video data:", error);
            }
        };

        fetchVideoData();
    }, [data_id]);


  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
    <div className="flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      <div className="flex  mt-7" >
        <Sidebar sidebarOpen={sidebarOpen}  />
        <div
          id="content"
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'} w-full pt-12`} >

{/*           <h1>Video ID: {data_id}</h1>
          <video src="./videos/vid1.mp4" controls style={{height:'50%', width: '70%'}} ></video> */}
          <video src={videoSrc} controls poster={posterSrc} style={{ height: '50%', width: '70%' }}></video>




        </div>
      </div>
    </div>
    </>
  );
}
