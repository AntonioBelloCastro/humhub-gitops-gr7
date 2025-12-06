import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de capacidad
export const options = {
  stages: [
    { duration: '30s', target: 5 },  // Fase de Calentamiento: subimos a 5 usuarios
    { duration: '1m', target: 20 },  // Carga: mantenemos 20 usuarios trabajando
    { duration: '30s', target: 0 },  // Fase de Enfriamiento: bajamos el número de usuarios a 0
  ],
  thresholds: {
    // Definición de SLA:
    // Marcamos la prueba como fallida si el 95% de las peticiones tardan más de 500ms
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = 'http://IP_DEL_SERVIDOR';

export default function () {
  // 1. Visitamos la página de login para obtener el CSRF token (seguridad de HumHub)
  let res = http.get(`${BASE_URL}/user/auth/login`);

  // 2. Confirmamos que el servidor respondió "OK"
  check(res, {
    'Login Page cargada': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Simulamos la carga de recursos estáticos (CSS/JS)
  // Con esto conseguimos estresar el ancho de banda del servidor
  http.get(`${BASE_URL}/static/css/style.css`);
  
  sleep(2);
}
