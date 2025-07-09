import React from "react";
import newLogo from "../assets/newLogo.png";
import coverVideo from "../assets/coverVideo.mp4";
import reportImg from "../assets/reportImg.png";

const Home = () => {
  return (
    <>
      <section className="relative w-full h-screen bg-black overflow-hidden">
        {/* Fullscreen Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={coverVideo}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Centered Logo and Buttons */}
        <div className="absolute left-[50%] top-[50%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
          <img className="w-[27rem] object-cover" src={newLogo} alt="Logo" />
          <h1 className="text-white -mt-28 text-4xl text-nowrap font-semibold">
            Know Where, know How?
          </h1>
          <div className="gap-4 flex items-center mt-8">
            <button className="text-xl w-24 h-10 rounded bg-gray-800 text-white relative overflow-hidden group z-10 hover:text-white duration-1000">
              <span className="absolute bg-black w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
              <span className="absolute bg-gray-900 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
              Login
            </button>
            <button className="text-xl w-24 h-10 rounded bg-gray-800 text-white relative overflow-hidden group z-10 hover:text-white duration-1000">
              <span className="absolute bg-black w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
              <span className="absolute bg-gray-900 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
              Register
            </button>
          </div>
        </div>
      </section>
      <section className="w-full min-h-screen bg-gray-950 pt-12">
        <h1 className="text-center text-6xl font-bold text-white">
          GPS Tracking <span className="text-cyan-700">Made </span>
          <span className="text-orange-500">it </span>
          <span className="text-red-500">easy</span>
        </h1>
        <div className="flex justify-center items-center mt-12 flex-col">
          <p className="text-center w-[69%] mb-6 text-white text-[1.4rem]">
            As an epitome of trust and stable solutions ensuring 99% uptime, our
            Fleet Management Solutions strives to excel with world class
            technology and expertise aspiring to bring together the largest
            network of state of the art GPS hardware, software and PAN India
            support services.
          </p>
          <button class="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-10 px-11 py-6 inline-flex">
            <div class="flex items-center">
              <span class="ml-1 text-white lg:inline p-1">Know More</span>
            </div>
          </button>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-[5.8rem]">
            <div>
              <h1>SOFTWARE AS A SERVICE</h1>
              <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <div>
              <h1>SOFTWARE AS A SERVICE</h1>
              <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>
          </div>
          <img className="object-cover w-92" src={reportImg} alt="" />
          <div className="flex flex-col gap-[5.8rem]">
            <div>
              <h1>SOFTWARE AS A SERVICE</h1>
              <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <div>
              <h1>SOFTWARE AS A SERVICE</h1>
              <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
