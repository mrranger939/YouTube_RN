import { Skeleton } from "@heroui/react";
import { formatViews, formatDuration, formatUploadTime } from "../utils/formatter";
export default function VCards({ Vdata, Cdata }) {
  console.log(Vdata, Cdata);

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
