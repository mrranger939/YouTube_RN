import { useState } from "react";
import "./Cards.css";
import { User, Card, CardFooter, Image, Button, CardHeader } from "@nextui-org/react";
import nawphot from "/images/nawaz_logo.jpg";
import thumb1 from "/thumbnails/1.webp"
import thumb2 from "/thumbnails/2.webp"
import thumb3 from "/thumbnails/3.webp"
import thumb4 from "/thumbnails/4.webp"

function OGCards() {
  var no_views = "30.3k";
  var upload_time = "69 minutes";
  var desc = no_views + " views • " + upload_time + " ago";

  

  return (
    <div className="youtubern_customcardgrid">
      <Card isFooterBlurred radius="lg" className="youtubern_customcards flex m-2"  fullWidth="false">
        <CardHeader>
        <Image
          alt="Woman listing to music"
          className="object-cover youtubern_customcards_img"
          height={999}
          // src="https://nextui.org/images/hero-card.jpeg"
          src={thumb1}
          width={999}
        />
        </CardHeader>
        {/* <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10"> */}
        <CardFooter className="justify-between">
          <User
            name="Nawaz"
            description={desc}
            avatarProps={{
              src: nawphot,
            }}
          ></User>
          {/* <p className="text-tiny text-dark/80">Available soon.</p> */}
          {/* <Button
            className={sub_text}
            variant={sub_btn}
            color={sub_color}
            radius="lg"
            size="sm"
            onClick={chg_sub_status}
          >
            {sub_status}
          </Button> */}
        </CardFooter>
      </Card>

      <Card isFooterBlurred radius="lg" className="youtubern_customcards flex m-2">
        <CardHeader>
        <Image
          alt="Woman listing to music"
          className="object-cover youtubern_customcards_img"
          height={999}
          
          src={thumb2}
          width={999}
        />
        </CardHeader>
        
        
        <CardFooter className="justify-between">
          <User
            name="Nawaz"
            description={desc}
            avatarProps={{
              src: nawphot,
            }}
          ></User>
          
          
        </CardFooter>
      </Card>

      <Card isFooterBlurred radius="lg" className="youtubern_customcards flex m-2">
        <CardHeader>
        <Image
          alt="Woman listing to music"
          className="object-cover youtubern_customcards_img"
          height={999}
          
          src={thumb3}
          width={999}
        />
        </CardHeader>
        
        <CardFooter className="justify-between">
          <User
            name="Nawaz"
            description={desc}
            avatarProps={{
              src: nawphot,
            }}
          ></User>
          
        </CardFooter>
      </Card>

      <Card isFooterBlurred radius="lg" className="youtubern_customcards flex m-2">
        <CardHeader>
        <Image
          alt="Woman listing to music"
          className="object-cover youtubern_customcards_img"
          height={999}
          
          src={thumb4}
          width={999}
        />
        </CardHeader>
        
        <CardFooter className="justify-between">
          <User
            name="Nawaz"
            description={desc}
            avatarProps={{
              src: nawphot,
            }}
          ></User>          
        </CardFooter>
      </Card>
      <Card isFooterBlurred radius="lg" className="youtubern_customcards flex m-2">
        <CardHeader>
        <Image
          alt="Woman listing to music"
          className="object-cover youtubern_customcards_img"
          height={999}
          
          src={thumb2}
          width={999}
        />
        </CardHeader>
        
        
        <CardFooter className="justify-between">
          <User
            name="Nawaz"
            description={desc}
            avatarProps={{
              src: nawphot,
            }}
          ></User>
          
          
        </CardFooter>
      </Card>
      
      <Card isFooterBlurred radius="lg" className="youtubern_customcards flex m-2">
        <CardHeader>
        <Image
          alt="Woman listing to music"
          className="object-cover youtubern_customcards_img"
          height={999}
          
          src={thumb2}
          width={999}
        />
        </CardHeader>
        
        
        <CardFooter className="justify-between">
          <User
            name="Nawaz"
            description={desc}
            avatarProps={{
              src: nawphot,
            }}
          ></User>
          
          
        </CardFooter>
      </Card>
      
    </div>
    
  );
}

export default OGCards;
