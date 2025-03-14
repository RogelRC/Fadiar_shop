"use client"

import { useEffect, useState } from "react";
import { Suspense } from "react";
import ProductList from "./ProductList";
import Coming from "@/components/Coming/Coming";
import Footer from "@/components/Footer/Footer";
import { FloatingCart } from "@/components/CartActions/FloatingCart";

export default function ProductosPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const userData = localStorage.getItem("userData");
            setIsAuthenticated(!!userData);
        };

        checkAuth();

        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    const cartData = {
        carrito: [],
        expiran: false,
    };

    return (
        <Suspense>
            <ProductList />
            {/*<Coming/>*/}
            <Footer />
            {isAuthenticated && <FloatingCart cartData={cartData} />}
        </Suspense>
    );
}