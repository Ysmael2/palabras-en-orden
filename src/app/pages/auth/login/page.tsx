'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/app/models/AuthScheme';
import axios from 'axios';
import { useAuthStore } from '@/app/stores/authStore';
import Image from 'next/image';
import Link from 'next/link';
import {EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Importar iconos

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    try {
      const { data } = await axios.post('/api/auth/login', {
        email: email.toLowerCase(),
        password,
      });

      setUser(data.user);
      setSuccess(true);
      router.push('/pages/home');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error al iniciar sesión');
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  };

  return (
    
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: "url('/login.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
        {(error || success) && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              success ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <p className="text-white">
              {success ? 'Login exitoso.' : error}
            </p>
          </div>
        )}
      <div
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h1>

      

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar sesión
          </button>

          <p className="text-center">
            ¿No tienes cuenta?{' '}
            <Link className="text-blue-600 hover:underline" href="/pages/auth/register">
              Registrarse
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}