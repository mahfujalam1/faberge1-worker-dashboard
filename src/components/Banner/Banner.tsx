'use client';
import React, { useEffect, useRef, useState } from "react";
import { PhoneCall } from "lucide-react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { OutlineButton } from "../ui/OutlineButton";
import Link from "next/link";
import { getUserInfo } from "@/services/authServices";
import { useGetAllDynamicBannerQuery } from "@/redux/api/publicApi";

const Banner = () => {
    const user = getUserInfo();
    const { data } = useGetAllDynamicBannerQuery(undefined);
    const bannerVideo = data?.data.find((banner: any) => banner.title === 'home');
    console.log(bannerVideo?.video);

    // State to track if component has mounted on the client side
    const [isClient, setIsClient] = useState(false);

    // Video ref to control playback
    const videoRef = useRef<HTMLVideoElement>(null);

    // Set client-side flag after mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Ensure video plays on mount after it's available
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.error('Error attempting to play video:', error);
            });
        }
    }, [bannerVideo]);  // Trigger when the video URL changes

    // Render content only on the client side
    if (!isClient) return null;

    return (
        <section className="relative w-full min-h-screen py-28 flex items-center justify-center overflow-hidden -mt-[80px]">
            {/* Background Video */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src={bannerVideo?.video || "/videos/banner-video.mp4"} type="video/mp4" />
                <source src={bannerVideo?.video.replace('.mp4', '.webm')} type="video/webm" />
                <source src={bannerVideo?.video.replace('.mp4', '.ogv')} type="video/ogg" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-3xl px-4">
                <h1 className="text-xl md:text-5xl font-extrabold leading-tight mb-4">
                    <span className="block">In-Home </span>
                    <span className="block">Manicure $25 / Pedicure $35</span> for Seniors
                </h1>

                <p className="text-gray-200 text-md md:text-base mb-8">
                    No more waiting in line or struggling to get to the salon. Rest easy,
                    we’ll come to you! If you’re 55 or older, get your manicures and
                    pedicures done in the comfort of your own home or facility!
                </p>

                {/* Buttons */}
                <div className="rounded-lg mb-10 py-8 bg-white/10 md:mx-12">
                    {
                        user?.email ? <Link href="/bookings"><PrimaryButton name="Book Appointment" /></Link> : <div className="flex justify-evenly">
                            <Link href="/auth/sign-up"><PrimaryButton name="Register Now" /></Link>
                            <Link href="/auth/sign-in"><OutlineButton name="Sign In" /></Link>
                        </div>
                    }
                </div>

                {/* Phone Contact */}
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center gap-2">
                        <PhoneCall size={30} className="text-white" />
                        <span className="md:text-4xl text-2xl font-bold">1(855) 622-6264</span>
                    </div>
                    <span className="md:text-2xl text-lg text-gray-300">Call Or Book Online</span>
                </div>
            </div>
        </section>
    );
};

export default Banner;
