import React, { useState, useEffect } from 'react';
import "./Cards.css";
import { User, Card, CardFooter, Image, Button, CardHeader } from "@nextui-org/react";
import thumb1 from "/thumbnails/1.webp";
import nawphot from "/images/nawaz_logo.jpg";

const Hehe = () => {
  const [data, setData] = useState([]); // State to hold API data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch data from the API
  useEffect(() => {
    fetch('http://127.0.0.1:5555/api')
      .then(response => response.json()) // Parse the JSON response
      .then(responseData => {
        // Parse the stringified JSON in the response data
        const parsedData = responseData.map(item => JSON.parse(item));
        setData(parsedData); // Set the parsed data to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Helper function to format views, duration, and upload time
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M'; // Convert to 'k' format
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K'; // Convert to 'k' format
    }
    return views.toString(); // Otherwise, just return the views as is
  };

  const formatUploadTime = (uploadTime) => {
    const diff = Math.abs(new Date() - new Date(uploadTime)) / 1000;
    const minutesAgo = Math.floor(diff / 60);
    return `${minutesAgo} minutes ago`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="youtubern_customcardgrid">
      {data.map((item) => (
        <Card key={item._id.$oid} isFooterBlurred radius="lg" className="youtubern_customcards flex m-2" fullWidth="false">
          <CardHeader>
            <Image
              alt="Thumbnail"
              className="object-cover youtubern_customcards_img"
              height={999}
              src={thumb1} // You can customize this as per your data
              width={999}
            />
          </CardHeader>

          <CardFooter className="justify-between">
            <User
              name={item.title}
              description={`${formatViews(item.views)} views • ${formatUploadTime(item.upload_time)}`}
              avatarProps={{
                src: 'nawphot', // Customize this as per your data
              }}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Hehe;