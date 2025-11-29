import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba (M7 - Capacidad)
export const options = {
  stages: [
    { duration: '30s', target: 5 },  // Calentamiento: subir a 5 usuarios
    { duration: '1m', target: 20 },  // Carga: mantener 20 usuarios (M7)
    { duration: '30s', target: 0 },  // Enfriamiento: bajar a 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones deben ser más rápidas de 500ms
  },
};

const BASE_URL = 'http://IP_DEL_SERVIDOR'; // CAMBIAR ESTO por la IP real cuando te den las máquinas

export default function () {
  // 1. Visitar la página de login para obtener el CSRF token (seguridad de HumHub)
  let res = http.get(`${BASE_URL}/user/auth/login`);
  
  check(res, {
    'Login Page cargada': (r) => r.status === 200,
  });

  // Aquí simularíamos el login extrayendo el token, pero para la prueba básica
  // de carga inicial, atacaremos la página pública o de login repetidamente
  // para generar estrés en la CPU/RAM.

  sleep(1);

  // 2. Simular carga de recursos estáticos (CSS/JS)
  // Esto estresa el ancho de banda del servidor
  http.get(`${BASE_URL}/static/css/style.css`);
  
  sleep(2);
}
