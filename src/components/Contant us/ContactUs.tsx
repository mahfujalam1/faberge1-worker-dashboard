"use client";

import { IMAGES } from "@/constants/image.index";
import { useContactUsMutation } from "@/redux/api/publicApi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type React from "react";
import { toast } from "sonner";

export default function ContactSection() {
    const path = usePathname();
    const [addContactUs] = useContactUsMutation();

    // State to handle form inputs
    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        subject: "",
        message: ""
    });

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Format data into the desired object structure
        const dataToSend = {
            firstName: formData.firstName,
            email: formData.email,
            message: formData.message,
            subject: formData.subject,
        };

        // Sending the formatted data
        try {
            const res = await addContactUs(dataToSend);
            if (res?.data) {
                toast.success(res?.data?.message || "Form submitted successfully");
            } else if (res?.error) {
                toast.error((res?.error as any)?.data?.message || "Failed to submit the form");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // ✅ Gradient background only on /contact route
    const sectionBg =
        path === "/contact"
            ? "bg-gradient-to-tl from-[#fdeaea] via-[#fff1f3] to-[#ffdae1]"
            : "bg-transparent";

    return (
        <section className={`py-20 px-4 ${sectionBg} transition-all duration-500`}>
            <div className="container !mx-auto flex flex-col items-center justify-center">
                <div className="md:flex">
                    {/* Image Section */}
                    <div>
                        <Image
                            src={IMAGES.perfume.src}
                            alt="Contact Us"
                            width={600}
                            height={400}
                            className="w-full md:h-[790px] h-[570px] rounded-s-lg shadow-lg"
                        />
                    </div>

                    {/* Contact Form Section */}
                    <div className="bg-[#FDE4DB] rounded-e-lg p-8 sm:p-10 lg:p-12 shadow-lg w-full md:w-[650px]">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 flex justify-center lg:text-left pt-20 pb-5">
                            Contact Us
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* First Name */}
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Full Name"
                                required
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-md border border-gray-800 focus:border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                            />

                            {/* Subject */}
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                required
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-md border border-gray-800 focus:border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                            />

                            {/* Email */}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-md border border-gray-800 focus:border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                            />

                            {/* Message */}
                            <textarea
                                name="message"
                                placeholder="Message"
                                required
                                rows={6}
                                value={formData.message}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-md border border-gray-800 focus:border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
                            />

                            {/* Button */}
                            <div className="flex justify-center lg:justify-center">
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer sm:w-auto px-12 py-3 bg-primary hover:bg-pink-700 text-white font-semibold rounded-md transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
