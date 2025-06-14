'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AppContext';
import TodoData from '../components/TodoData';

const Todo = () => {
  const [light, setLight] = useState(false);
  const { token, logout } = useAuth();
  const router = useRouter();
  const handleClick = () => setLight(!light);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="min-h-screen flex flex-col items-center w-full box-border font-sans">
      <div
        className={`
          flex justify-between items-center w-full 
          bg-cover bg-center bg-no-repeat 
          px-8 h-[200px] 
          sm:px-4 sm:h-[150px]
          ${light ? 'bg-[url("/bg-desktop-light.jpg")]' : 'bg-[url("/bg-desktop-dark.jpg")]'}
        `}
      >
        <button onClick={logout} className="text-white text-3xl sm:text-2xl m-0 cursor-pointer">LOG OUT</button>
        <button onClick={handleClick} className="outline-none border-none bg-transparent cursor-pointer">
          <img src={light ? `/icon-sun.svg` : `/icon-moon.svg`} className="w-[30px] h-[30px] sm:w-[25px] sm:h-[25px]" alt="Toggle theme" />
        </button>
      </div>

      <div
        className={`
          flex justify-center w-full overflow-auto pt-5 
          min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-150px)] 
          ${light ? 'bg-[aliceblue]' : 'bg-[rgb(21,21,95)]'}
        `}
      >
        <TodoData light={light} />
      </div>
    </div>
  );
};

export default Todo;
