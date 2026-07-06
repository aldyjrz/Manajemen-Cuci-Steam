
import {useEffect} from 'react'
import {routes} from '../routes/config';
import { useLocation } from 'react-router-dom';
  
const siteName = "Steam Jaya Motor"; // nanti ambil dari Context/API

export default function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const route = routes.find((r) => r.path === location.pathname);

    document.title = route
      ? `${route.title} | ${siteName}`
      : siteName;
  }, [location]);

  return null;
}
