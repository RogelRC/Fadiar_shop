import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Slideshow from "@/components/Slideshow";
import Info from "@/components/Info"
import Carousel from "@/components/Slider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Fadiar",
    description: "Tienda online",
};

export default function RootLayout() {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div className="flex flex-col pt-[10vh]">
            <Header/>
            <Slideshow/>
            <Info/>

        </div>
        </body>
        </html>
    );
}
