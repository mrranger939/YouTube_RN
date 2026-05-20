import "./Cards.css";
import {
  User,
  Card,
  CardFooter,
  Image,
  CardHeader,
} from "@heroui/react";
import nawphot from "/images/nawaz_logo.jpg";
import thumb1 from "/thumbnails/1.webp";
import thumb2 from "/thumbnails/2.webp";
import thumb3 from "/thumbnails/3.webp";
import thumb4 from "/thumbnails/4.webp";

function StubCards() {
  var no_views = "30.3k";
  var upload_time = "69 minutes";
  var desc = no_views + " views • " + upload_time + " ago";

  return (
    <div className="youtubern_customcardgrid">
      <Card
        isFooterBlurred
        radius="lg"
        className="youtubern_customcards flex m-2"
        fullWidth="false"
      >
        <CardHeader>
          <Image
            alt="Woman listing to music"
            className="object-cover youtubern_customcards_img"
            src={thumb1}

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

      <Card
        isFooterBlurred
        radius="lg"
        className="youtubern_customcards flex m-2"
      >
        <CardHeader>
          <Image
            alt="Woman listing to music"
            className="object-cover youtubern_customcards_img"
            src={thumb2}
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

      <Card
        isFooterBlurred
        radius="lg"
        className="youtubern_customcards flex m-2"
      >
        <CardHeader>
          <Image
            alt="Woman listing to music"
            className="object-cover youtubern_customcards_img"
            src={thumb3}
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

      <Card
        isFooterBlurred
        radius="lg"
        className="youtubern_customcards flex m-2"
      >
        <CardHeader>
          <Image
            alt="Woman listing to music"
            className="object-cover youtubern_customcards_img"
            src={thumb4}
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
      <Card
        isFooterBlurred
        radius="lg"
        className="youtubern_customcards flex m-2"
      >
        <CardHeader>
          <Image
            alt="Woman listing to music"
            className="object-cover youtubern_customcards_img"
            src={thumb2}
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

      <Card
        isFooterBlurred
        radius="lg"
        className="youtubern_customcards flex m-2"
      >
        <CardHeader>
          <Image
            alt="Woman listing to music"
            className="object-cover youtubern_customcards_img"
            src={thumb2}
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

export default StubCards;
