// next.config.js
const nextConfig = {
    trailingSlash: true,
    output: 'export',
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "app.fadiar.com", // Especifica solo tu dominio
            },
            // Elimina los comodines (**) por seguridad
        ],
        unoptimized: true, // Obligatorio para 'output: export'
    },
};

export default nextConfig;