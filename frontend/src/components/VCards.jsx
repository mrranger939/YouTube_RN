import { Skeleton } from "@heroui/react";
export default function VCards({ Vdata, Cdata }) {
  console.log(Vdata, Cdata);

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
    console.log(views)
    if (views >= 1000000) {
      return Math.floor(views / 1000000).toFixed(1) + "M"; // Convert to 'k' format
    }
    if (views >= 1000) {
      return Math.floor(views / 1000).toFixed(1) + "K"; // Convert to 'k' format
    }
    return views.toString(); // Otherwise, just return the views as is
  };

  const formatUploadTime = (uploadTime) => {
    const diff = Math.abs(new Date() - new Date(uploadTime)) / 1000;
    if(diff<60){
      var d=Math.floor(diff/1);
      return d==1?`${d} second ago`:`${d} seconds ago`
    }
    const minutesAgo = Math.floor(diff / 60);
    if(minutesAgo<60){
      return minutesAgo==1?`${minutesAgo} minute ago`:`${minutesAgo} minutes ago`;
    }
    else if(minutesAgo<1440){
      const hoursAgo = Math.floor(minutesAgo/60);
      return hoursAgo==1?`${hoursAgo} hour ago`:`${hoursAgo} hours ago`;
    }
    else if(minutesAgo<10080){
      const daysAgo = Math.floor(Math.floor(minutesAgo/60)/24)
      return daysAgo==1?`${daysAgo} day ago`:`${daysAgo} days ago`;
    }
    else if(minutesAgo<43800){
      const weeksAgo = Math.floor(Math.floor(Math.floor(minutesAgo/60)/24)/7)
      return weeksAgo==1?`${weeksAgo} week ago`:`${weeksAgo} weeks ago`;
    }
    else if(minutesAgo<525600){
      const monthsAgo = Math.floor(Math.floor(Math.floor(Math.floor(minutesAgo/60)/24)/7)/4)
      return monthsAgo==1?`${monthsAgo} month ago`:`${monthsAgo} months ago`;
    }
    else{
      const yearsAgo = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(minutesAgo/60)/24)/7)/4)/12)
      return yearsAgo==1?`${yearsAgo} year ago`:`${yearsAgo} years ago`;
    }
  };

  return (
    <>
      <div className="rounded-xl m-2">
        <div className="rounded-xl mb-4 flex flex-row items-start">
          <div className="w-full">
            <img src={Cdata.logo} className="rounded-xl w-full" alt="" />
          </div>

          <div className="video-details bg-light mx-2 w-full rounded-xl ">
            <h3 className="v-title text-base leading-5 line-clamp-2 text-ellipsis whitespace-normal font-medium tracking-tight">
              {Vdata.videoTitle ? (
                Vdata.videoTitle
              ) : (
                <>
                  <Skeleton className="w-full h-3 rounded-xl my-3" />
                  <Skeleton className="w-1/2 h-3 rounded-xl mb-3" />
                </>
              )}
            </h3>
            <div className="ch my-1 text-gray-600 text-sm">
              {Cdata.channelName ? (
                Cdata.channelName
              ) : (
                // <img src={CD.logo}  className="flex rounded-full" />
                (<Skeleton className="rounded-full w-full h-2" />)
              )}
            </div>
            <div className="vd my-1 text-gray-600 text-xs">
              {Vdata.views || Vdata.timestamp ? (
                
                formatViews(Vdata.views)+" views • "+formatUploadTime(Vdata.timestamp)


              ) : (
                // <img src={CD.logo}  className="flex rounded-full" />
                (<>
                  <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                  <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                </>)
              )}
            </div>
          </div>
          <div>:</div>
        </div>
        <div className="rounded-xl mb-4 flex flex-row items-start">
          <div className="w-full">
            <img src={Cdata.logo} className="rounded-xl w-full" alt="" />
          </div>

          <div className="video-details bg-light mx-2 w-full rounded-xl ">
            <h3 className="v-title text-base leading-5 line-clamp-2 text-ellipsis whitespace-normal font-medium tracking-tight">
              {Vdata.videoTitle ? (
                Vdata.videoTitle
              ) : (
                <>
                  <Skeleton className="w-full h-3 rounded-xl my-3" />
                  <Skeleton className="w-1/2 h-3 rounded-xl mb-3" />
                </>
              )}
            </h3>
            <div className="ch my-1 text-gray-600 text-sm">
              {Cdata.channelName ? (
                Cdata.channelName
              ) : (
                // <img src={CD.logo}  className="flex rounded-full" />
                (<Skeleton className="rounded-full w-full h-2" />)
              )}
            </div>
            <div className="vd my-1 text-gray-600 text-xs">
              {Vdata.views || Vdata.timestamp ? (
                
                formatViews(Vdata.views)+" views • "+formatUploadTime(Vdata.timestamp)


              ) : (
                // <img src={CD.logo}  className="flex rounded-full" />
                (<>
                  <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                  <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                </>)
              )}
            </div>
          </div>
          <div>:</div>
        </div>
        <div className="rounded-xl mb-4 flex flex-row items-start">
          <div className="w-full">
            <img src={Cdata.logo} className="rounded-xl w-full" alt="" />
          </div>

          <div className="video-details bg-light mx-2 w-full rounded-xl ">
            <h3 className="v-title text-base leading-5 line-clamp-2 text-ellipsis whitespace-normal font-medium tracking-tight">
              {Vdata.videoTitle ? (
                Vdata.videoTitle
              ) : (
                <>
                  <Skeleton className="w-full h-3 rounded-xl my-3" />
                  <Skeleton className="w-1/2 h-3 rounded-xl mb-3" />
                </>
              )}
            </h3>
            <div className="ch my-1 text-gray-600 text-sm">
              {Cdata.channelName ? (
                Cdata.channelName
              ) : (
                // <img src={CD.logo}  className="flex rounded-full" />
                (<Skeleton className="rounded-full w-full h-2" />)
              )}
            </div>
            <div className="vd my-1 text-gray-600 text-xs">
              {Vdata.views || Vdata.timestamp ? (
                
                formatViews(Vdata.views)+" views • "+formatUploadTime(Vdata.timestamp)


              ) : (
                // <img src={CD.logo}  className="flex rounded-full" />
                (<>
                  <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                  <Skeleton className="rounded-full mx-0.5 w-1/2 h-2" />
                </>)
              )}
            </div>
          </div>
          <div>:</div>
        </div>

      </div>
    </>
  );
}
