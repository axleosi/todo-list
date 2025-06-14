'use client'
import Link from 'next/link';
import { useAuth } from './context/AppContext';

export default function Home() {
  const {isAuthenticated}=useAuth()


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Your Todo App</h1>
      <p className="text-lg mb-6">Stay organized and productive.</p>
      <Link
        href={isAuthenticated ? "/logout" : "/signup"}
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        {isAuthenticated ? 'Log Out' : 'Sign Up'}
      </Link>
    </div>
  );
}
