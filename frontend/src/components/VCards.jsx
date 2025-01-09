import { Skeleton } from "@nextui-org/react";
export default function VCards({ Vdata, Cdata }) {
  console.log(Vdata,Cdata)
  return (
    <>
      <div className="rounded-xl m-2">
        <div className="rounded-xl mb-2 flex flex-row">
          <img src={Cdata.logo} className="rounded-xl w-40" alt="" />

          <div className="video-details bg-light mx-2 w-full rounded-xl ">
            <h1
              className="v-title font-bold tracking-tight"
              style={{ fontSize: "20px" }}
            >
              {Vdata.title ? (
                ABCD
              ) : (
                <>
                  <Skeleton className="w-full h-3 rounded-xl my-3" />
                  <Skeleton className="w-1/2 h-3 rounded-xl mb-3" />
                </>
              )}
            </h1>
            {Vdata.title ? (
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
        </div>

      </div>
    </>
  );
}
