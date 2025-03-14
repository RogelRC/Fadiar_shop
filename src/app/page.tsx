"use client"

import { Suspense } from 'react';
import Slideshow from "@/components/Home/Slideshow";
import Info from "@/components/Home/Info";
import Carousel from "@/components/Home/Carousel";
import Topsells from "@/components/Home/Topsells";
import Footer from '@/components/Footer/Footer';

export default function Home() {
    return (
        <>
            <Suspense fallback={<div>Cargando presentación...</div>}>
                <Slideshow />
            </Suspense>

            <Info />

            {/*<div className="w-full h-2 bg-[#022953] my-12" />*/}

            {/*
            <Suspense fallback={<div>Cargando destacados...</div>}>
                <Carousel/>
            </Suspense>
            
            <div>
                <Suspense>
                    <Topsells/>
                </Suspense>
            </div>
            */}

            <Footer/>
        </>
    );
}