// app/Products/page.tsx

"use client"

import { Suspense } from "react";
import ProductList from "./ProductList";
import Coming from "@/components/Coming/Coming";
import Footer from "@/components/Footer/Footer";

export default function ProductosPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <ProductList />
            <Coming/>
            <Footer/>
        </Suspense>
    );
}