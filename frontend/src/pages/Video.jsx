import React, { useState, useEffect } from "react";
import { Skeleton,Button } from "@nextui-org/react";
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

  // For the Subscribe Button
  const [sub_status, set_sub_status] = useState("Subscribe");
  const [sub_color, set_sub_color] = useState("danger");
  const [sub_text, set_sub_text] = useState("text-tiny text-white");
  const [sub_btn, set_sub_btn] = useState("solid");

  const chg_sub_status = () => {
    if (sub_status === "Subscribe") {
      set_sub_status("Subscribed");
      set_sub_color("default");
      set_sub_text("text-tiny text-dark")
      set_sub_btn("ghost")
    }
    else{
      set_sub_status("Subscribe");
      set_sub_color("danger");
      set_sub_text("text-tiny text-white")
      set_sub_btn("solid")
    }
  };


  return (
    <>
    <div className="flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      <div className="flex  mt-7" >
        <Sidebar sidebarOpen={sidebarOpen}  />
        <div
          id="content"
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'm-3 mt-0'} w-full pt-12`} style={{display:"grid",gridTemplateColumns:"70% 30%"}} >

{/*           <h1>Video ID: {data_id}</h1>
          <video src="./videos/vid1.mp4" controls style={{height:'50%', width: '70%'}} ></video> */}
          <div className="video" style={{display:'grid',gridTemplateRows:'65% 13% 25%'}}>

            <Skeleton className="flex rounded-lg m-3">

              <video src={videoSrc} controls poster={posterSrc} style={{ height: '50%', width: '70%' }}></video>

            </Skeleton>

            <div className="video-details bg-light m-3 rounded-lg">

              <h1 className="v-title font-bold" style={{fontSize:'1.25rem'}}>Sachhhhi, Ye Kandi Sab Barbad Kardega! ⋮ Deadpool & Wolverine ⋮ Deadpool 3</h1>

              <div className="video-actions mt-1" style={{display:'grid',gridTemplateColumns:'40% 30% 10% 10% 10%'}}>

                <div className="max-w-[350px] w-full flex items-center gap-3 mt-2">
            
                <div>
                  <Skeleton className="flex rounded-full w-10 h-10"/>
                </div>  
            
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-4/5 rounded-lg"/>
                  <Skeleton className="h-3 w-3/5 rounded-lg"/>
                </div>
            
                <div className="subscribe ml-1">
                  <Button
              className={sub_text}
              variant={sub_btn}
              color={sub_color}
              radius="full"
              size="md"
              onClick={chg_sub_status}>
              {sub_status}
                  </Button>
                </div>
            
                </div>

                <div ></div>
                
                <Button isIconOnly className="m-1" variant="ghost" color="danger" aria-label="Like">
                  
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0501 7.04419C15.4673 5.79254 14.5357 4.5 13.2163 4.5C12.5921 4.5 12.0062 4.80147 11.6434 5.30944L8.47155 9.75H5.85748L5.10748 10.5V18L5.85748 18.75H16.8211L19.1247 14.1428C19.8088 12.7747 19.5406 11.1224 18.4591 10.0408C17.7926 9.37439 16.8888 9 15.9463 9H14.3981L15.0501 7.04419ZM9.60751 10.7404L12.864 6.1813C12.9453 6.06753 13.0765 6 13.2163 6C13.5118 6 13.7205 6.28951 13.627 6.56984L12.317 10.5H15.9463C16.491 10.5 17.0133 10.7164 17.3984 11.1015C18.0235 11.7265 18.1784 12.6814 17.7831 13.472L15.8941 17.25H9.60751V10.7404ZM8.10751 17.25H6.60748V11.25H8.10751V17.25Z" fill="#080341"></path> </g></svg>
                </Button>
                
                <Button isIconOnly className="m-1" variant='ghost' color="warning" aria-label="Like">
                
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0501 16.9558C15.4673 18.2075 14.5357 19.5 13.2164 19.5C12.5921 19.5 12.0063 19.1985 11.6435 18.6906L8.47164 14.25L5.85761 14.25L5.10761 13.5L5.10761 6L5.85761 5.25L16.8211 5.25L19.1247 9.85722C19.8088 11.2253 19.5407 12.8776 18.4591 13.9592C17.7927 14.6256 16.8888 15 15.9463 15L14.3982 15L15.0501 16.9558ZM9.60761 13.2596L12.8641 17.8187C12.9453 17.9325 13.0765 18 13.2164 18C13.5119 18 13.7205 17.7105 13.6271 17.4302L12.317 13.5L15.9463 13.5C16.491 13.5 17.0133 13.2836 17.3984 12.8985C18.0235 12.2735 18.1784 11.3186 17.7831 10.528L15.8941 6.75L9.60761 6.75L9.60761 13.2596ZM8.10761 6.75L6.60761 6.75L6.60761 12.75L8.10761 12.75L8.10761 6.75Z" fill="#080341"></path> </g></svg>
                
                  </Button>
                
                <Button isIconOnly className="m-1" variant='ghost' color="primary" aria-label="Like">

                <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.734 15.8974L19.22 12.1374C19.3971 11.9927 19.4998 11.7761 19.4998 11.5474C19.4998 11.3187 19.3971 11.1022 19.22 10.9574L14.734 7.19743C14.4947 6.9929 14.1598 6.94275 13.8711 7.06826C13.5824 7.19377 13.3906 7.47295 13.377 7.78743V9.27043C7.079 8.17943 5.5 13.8154 5.5 16.9974C6.961 14.5734 10.747 10.1794 13.377 13.8154V15.3024C13.3888 15.6178 13.5799 15.8987 13.8689 16.0254C14.158 16.1521 14.494 16.1024 14.734 15.8974Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                  </Button>

              </div>
              
            </div>

            <div className="discription bg-black m-3 mt-2 rounded-lg" >

            </div>

          </div>


          <div className="cards bg-black m-2 rounded-lg" style={{height:"100vh"}}>

          </div>



        </div>
      </div>
    </div>
    </>
  );
}
