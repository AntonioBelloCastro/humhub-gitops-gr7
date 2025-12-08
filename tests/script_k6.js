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
    // Marcamos la prueba como fallida si el 95% de las peticiones tardan más de 2000ms
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = 'http://10.43.183.184'; 

export default function () {
  let res = http.get(`${BASE_URL}`);
  
  // Confirmamos que el servidor responde "OK"
  check(res, {
    'Status es 200': (r) => r.status === 200,
  });

  sleep(1);
}
