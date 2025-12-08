'use client';
import { ServiceCard } from "../ui/ServiceCard";
import Image from "next/image";
import { IMAGES } from "@/constants/image.index";
import SectionHeader from "../ui/SectionHeader";
import { usePathname } from "next/navigation";
import { useGetAllDynamicBannerQuery } from "@/redux/api/publicApi";

export default function ServicesSection() {
    const path = usePathname();
    const { data } = useGetAllDynamicBannerQuery(undefined);
    const manicureBannerImage = data?.data.find((banner: any) => banner.title === 'manicure');
    const pedicureBannerImage = data?.data.find((banner: any) => banner.title === 'pedicure');
    

    const manicureData = {
        title: "Manicure",
        image: manicureBannerImage?.image || IMAGES.serviceCardImage1.src,
        services: [
            {
                title: "Manicure",
                options: ["With Gel", "Without Gel"],
            },
            {
                title: "Nail Polish",
                note: "Customer provided",
                options: ["Clear", "Colored"],
            },
        ],
        serviceTypes: ["Water Method", "Waterless Method"],
    };

    const pedicureData = {
        title: "Pedicure",
        image: pedicureBannerImage?.image || IMAGES.serviceCardImage2.src,
        services: [
            {
                title: "Pedicure",
                options: ["With Gel", "Without Gel"],
            },
            {
                title: "Nail Polish",
                note: "Customer provided",
                options: ["Clear", "Colored"],
            },
        ],
        serviceTypes: ["Water Method", "Waterless Method"],
    };

    return (
        <section className="relative min-h-screen">
            {/* Background */}
            {path === "/services" ? (
                // Gradient background when path is "/services"
                <div className="absolute inset-0 bg-gradient-to-tl from-[#fdeaea] via-[#fff1f3] to-[#ffdae1]" />
            ) : (
                // Image background otherwise
                <div className="absolute inset-0 pointer-events-none">
                    <Image
                        src={IMAGES.serviceBgImage.src}
                        alt="Pink wave background"
                        fill
                        className="object-fill"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                <SectionHeader sectionName="Our Services" />
                <div className="md:flex justify-around gap-8">
                    <ServiceCard {...manicureData} />
                    <ServiceCard {...pedicureData} />
                </div>
            </div>
        </section>
    );
}
