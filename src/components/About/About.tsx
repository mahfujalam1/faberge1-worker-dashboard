"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/constants/image.index";
import { usePathname } from "next/navigation";
import { useGetAboutUsQuery } from "@/redux/api/publicApi";

export default function About() {
    const { data } = useGetAboutUsQuery(undefined);
    const aboutUs = data?.aboutUs || "";
    const path = usePathname();

    // ✅ Apply gradient background only on "/about" route
    const sectionBg =
        path === "/about"
            ? "bg-gradient-to-tl from-[#fdeaea] via-[#fff1f3] to-[#ffdae1]"
            : "bg-transparent";

    return (
        <section className={`flex items-center py-16 ${sectionBg} transition-all duration-500`}>
            <div className="container mx-auto flex flex-col items-center justify-center">
                <div className="grid md:grid-cols-2 gap-12 items-center md:px-0 px-4">
                    {/* Left side - Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden p-4">
                            <Image
                                src={IMAGES.AboutImage.src}
                                alt="Spa pedicure treatment with flowers and natural elements"
                                width={500}
                                height={400}
                                className="w-full h-auto rounded-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="space-y-6 mb-5 ">
                        <div>
                            <div className="md:border-4 border-2 border-primary rounded-xl w-20" />
                            <h2 className="md:text-4xl text-xl font-bold text-primary mb-6">
                                About Us
                            </h2>
                        </div>

                        <p className="text-gray-700 leading-relaxed text-sm" dangerouslySetInnerHTML={{
                            __html: aboutUs || "",
                        }}>
                        </p>

                        <Button
                            variant="outline"
                            className="border-2 border-primary cursor-pointer text-primary hover:bg-primary hover:text-white px-8 py-6 text-base font-semibold rounded-lg transition-colors bg-transparent"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
