import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Demo from './components/Demo.tsx';
import InstallPWAButton from './components/InstallPWAButton.tsx';


createRoot(document.getElementById('root')!).render(
  <>
    <App />
    {/* <Demo /> */}
    <InstallPWAButton />
  </>
);
