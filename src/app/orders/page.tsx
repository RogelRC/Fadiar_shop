// pages/pedidos.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Definir interfaz para los pedidos
interface Pedido {
  id: number;
  date: string;
  direccionExacta?: string;
  municipio: string;
  provincia: string;
  state: number;
  delivery: number;
}

interface UserData {
  userId: number;
  // Agregar otras propiedades si existen
}

const API = process.env.NEXT_PUBLIC_API;

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUserId = (): number | null => {
    const userData = localStorage.getItem("userData");
    if (!userData) return null;

    try {
      const parsedData: UserData = JSON.parse(userData);
      return parsedData.userId;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const router = useRouter();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const managerId = getCurrentUserId();
        if (!managerId) {
          throw new Error('Usuario no autenticado');
        }

        const response = await fetch(`${API}/pedidos_manager`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_manager: managerId }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
        }

        const data: Pedido[] = await response.json();
        setPedidos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleSubmit = (pedido: Pedido) => {
    try {
      localStorage.setItem("orderId", pedido.id.toString());
      router.push('/ordersDetails'); // Navegación manual después de guardar
    } catch (error) {
      console.error(error);
    }
  };

  const getEstadoStyle = (state: number) => {
    switch(state) {
      case -1: return 'bg-[#E92A2A] text-white';
      case 0: return 'bg-blue-100 text-blue-800';
      case 1: return 'bg-[#26BB62] text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022953]"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
      <p>Error: {error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-[#022953] text-white rounded hover:bg-[#011a3a]"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#022953]">Mis Pedidos</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Fecha:</span>
                    <time className="text-gray-600">{pedido.date}</time>
                  </div>
                  
                  <div className="flex items-start gap-2 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Ubicación:</span>
                      <span className="text-gray-600">
                        {pedido.direccionExacta || 'Dirección no disponible'}, 
                        {` ${pedido.municipio}`}, {pedido.provincia}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getEstadoStyle(pedido.state)}`}>
                    {pedido.state === -1 ? 'Cancelada' : 
                     pedido.state === 1 ? 'Aceptado' :
                     pedido.state === 0 && pedido?.delivery === null ? 'En espera': 'Enviado'}
                  </span>
                  <button
                    onClick={() => handleSubmit(pedido)}
                    className="px-4 py-2 bg-[#022953] text-white rounded-lg hover:bg-[#011a3a] transition-colors text-sm"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pedidos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron pedidos registrados
          </div>
        )}
      </div>
    </section>
  );
}