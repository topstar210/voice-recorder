import { useEffect, useState } from 'react';
import {
  RouterProvider,
} from "react-router-dom";
import Cookies from 'js-cookie';
import router from "@/Router";

import API from "@/provider/API";

import iconMoon from '@/assets/images/icons/dark-mode.svg';
import iconSun from '@/assets/images/icons/light-mode.svg';
import iconLogout from '@/assets/images/icons/logout.svg';
import { useSelector } from 'react-redux';

const htmlElement = document.querySelector('html');


function App() {
  const app = useSelector((state: any) => state.sapp);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  function handleDarkMode() {
    setIsDarkModeEnabled(!isDarkModeEnabled);
    if (htmlElement) {
      if (isDarkModeEnabled) {
        Cookies.set('color_mode', 'dark', {
          expires: 365
        });

        htmlElement.classList.add('dark');
      } else {
        Cookies.remove('color_mode');

        htmlElement.classList.remove('dark');
      }
    }
  }

  useEffect(() => {
    if (Cookies.get('color_mode')) {
      setIsDarkModeEnabled(true);
    }
  }, []);

  const handleLogout = async () => {
    await API.auth.logout();
    window.location.href = "/login";
  }

  useEffect(() => {
    if (htmlElement) {
      if (isDarkModeEnabled) {
        htmlElement.classList.add('dark');

        Cookies.set('color_mode', 'dark', {
          expires: 365
        });
      } else {
        htmlElement.classList.remove('dark');

        Cookies.remove('color_mode');
      }
    }
  }, [isDarkModeEnabled]);

  return (
    <main>
      <button
        type="button"
        className="lg:fixed lg:right-8 lg:top-5 lg:z-10 lg:mb-0 mb-5 lg:ml-0 ml-auto w-10 h-10 bg-white dark:bg-text rounded-custom shadow flex justify-center items-center border border-black dark:border-white transition-transform duration-500 lg:transform hover:scale-110"
        onClick={handleDarkMode}
      >
        <img src={isDarkModeEnabled ? iconSun : iconMoon} alt="Moon" className="w-6 h-6 dark:invert" />
      </button>
      {app?.accToken !== "Invalid_Token" &&
        <button
          type="button"
          className="fixed right-14 lg:right-20 top-4 lg:top-5 z-10 mb-0 ml-0 w-10 h-10 bg-white dark:bg-text rounded-custom shadow flex justify-center items-center border border-black dark:border-white transition-transform duration-500 hover:scale-110"
          onClick={handleLogout}
        >
          <img src={iconLogout} alt="logout" className="w-6 h-6 dark:invert" />

        </button>
      }

      <RouterProvider router={router} />
    </main>
  );
}

export default App;
