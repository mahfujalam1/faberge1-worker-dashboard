"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/constants/image.index";
import Image from "next/image";

export default function CheckoutPage() {
    const router = useRouter();

    // // ✅ Redirect after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/my-bookings");
        }, 3000);

        return () => clearTimeout(timer); // cleanup
    }, [router]);

    return (
        <div>
            <div className="flex py-10 items-center justify-center bg-gradient-to-tl from-[#fdeaea] via-[#fff1f3] to-[#ffdae1] p-4 h-screen ">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-[#39AE86] pb-10">
                        Successfully Paid
                    </h1>

                    <Image
                        src={IMAGES.paymentSuccess.src}
                        alt="Payment Success"
                        width={700}
                        height={700}
                        className="mx-auto"
                    />
                </div>
            </div>
        </div>
    );
}