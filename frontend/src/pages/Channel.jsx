import React, { useEffect, useState } from "react";
import dfimg from "../assets/df.jpg";
import { Button } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import OGCards from "../components/Orginal_Cards";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cards from "../components/Cards";

export default function Channel() {
  const { channelid } = useParams();
  const [channelName, setChannelName] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [shorts, setShorts] = useState([]);
  const [subscribers, setSubscribers] = useState(0);
  const [videos, setVideos] = useState([]);
  const [numOfVideos, setNumOfVideos] = useState(0);
  console.log(channelid);
  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const ipAddress = import.meta.env.VITE_IP_ADD;
        const Wholedata  = await axios.get(
          `http://${ipAddress}:8000/channel/${channelid}`
        );
        console.log(Wholedata.data)
        const data = Wholedata.data.channelData
        setChannelName(data.channelName);
        setBanner(data.chn_banner);
        setDescription(data.description);
        setLogo(data.logo);
        setShorts(data.shorts);
        setSubscribers(data.subscribers);
        setVideos(Wholedata.data.video_data);
        setNumOfVideos(data.videos.length);
      } catch (e) {
        console.error("Error fetching channel data:", error);
      }
    };
    fetchChannelDetails();
  }, [channelid]);

  return (
    <>
      <div className="w-full px-3 md:px-10">
        <img
          src={banner}
          className="h-48 w-full mx-auto rounded-xl object-cover"
          alt="banner"
        />
      </div>
      <div className="m-7">
        <ProfileCard2
          channelName={channelName}
          logo={logo}
          description={description}
          subscribers={subscribers}
          numOfVideos={numOfVideos}
        />
      </div>
      <hr />
      <div className="m-5">
        <AllVideos videos={videos} />
      </div>
    </>
  );
}

function Subcr() {
  const [sub_status, setSubStatus] = useState("Subscribe");
  const [sub_color, setSubColor] = useState("danger");
  const [sub_text, setSubText] = useState("text-tiny text-white");
  const [sub_btn, setSubBtn] = useState("solid");

  const toggleSubscription = () => {
    if (sub_status === "Subscribe") {
      setSubStatus("Subscribed");
      setSubColor("default");
      setSubText("text-tiny text-dark");
      setSubBtn("ghost");
    } else {
      setSubStatus("Subscribe");
      setSubColor("danger");
      setSubText("text-tiny text-white");
      setSubBtn("solid");
    }
  };

  return (
    <Button
      className={sub_text}
      variant={sub_btn}
      color={sub_color}
      radius="full"
      size="md"
      onClick={toggleSubscription}
    >
      {sub_status}
    </Button>
  );
}

export function ProfileCard2({channelName, description, logo, numOfVideos, subscribers}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex flex-col md:flex-row my-3  ml-0">
        <div className="w-32 h-32 mx-auto md:mr-3 rounded-full overflow-hidden shadow-md">
          <img
            src={logo ? logo : dfimg}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mx-auto text-center md:text-left md:ml-3">
          <div className="md:mx-0">
            <div className="text-2xl font-extrabold">{channelName ? channelName : "Funny Videos"}</div>
            <div className="flex mx-auto w-fit md:w-auto space-x-2 text-gray-500 text-xs">
              <p>{subscribers ? subscribers : "0"} Subscribers</p>
              <p>{numOfVideos ? numOfVideos: "0"} Videos</p>
            </div>
            <div className="text-xs">
              <p>
                {description ? description.slice(0,50) + "....  " : "iam a good Youtuber"}
                <button className="text-blue-700" onClick={onOpen}>
                  More
                </button>
              </p>
            </div>
            <div className="subscribe ml-1">
              <Subcr />
            </div>                
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Description
              </ModalHeader>
              <ModalBody>
                <p>
                  {description}
                </p>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
{/*                 <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function AllVideos({videos}) {
  console.log(`in videos ########## ${videos} and type is ${typeof(videos)}`)
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" variant="underlined">
        <Tab key="videos" title="Videos">
          {/*           <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card> */}
          <Cards vid_list={videos} />
        </Tab>
        <Tab key="playlist" title="Playlist">
          {/*           <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </CardBody>
          </Card> */}
          <OGCards />
        </Tab>
        <Tab key="community" title="Community">
          {/*           <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </CardBody>
          </Card> */}
          <OGCards />
        </Tab>
      </Tabs>
    </div>
  );
}
