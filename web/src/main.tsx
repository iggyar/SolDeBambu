import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '@/App';
import {NEGOCIO} from '@/config/negocio';
import '@/index.css';

// Red de seguridad: mientras el número de WhatsApp siga siendo el de ejemplo,
// la consola lo grita en cada carga de desarrollo. Publicar la web con un
// número inventado sería el peor error posible acá — todos los botones de la
// página llevan ahí.
if (import.meta.env.DEV && NEGOCIO.whatsappEsPlaceholder) {
  console.warn(
    '⚠️  Sol de Bambú: el número de WhatsApp sigue siendo el de ejemplo ' +
      `(${NEGOCIO.whatsapp}). Cámbialo en src/config/negocio.ts y pon ` +
      'whatsappEsPlaceholder en false antes de publicar.',
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
