# 🌦️🌍 API Meteorológica y Sísmica

Una API REST desarrollada con Node.js, Express, TypeScript y MongoDB para gestionar datos meteorológicos y sísmicos.

## 🚀 Instalación y Ejecución

### 🔧 Requisitos previos
- Node.js (v16+)
- MongoDB (v4.4+)
- npm (v8+)

### ⚙️ Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/Anthonny123/Proyecto-Topicos-especiales-de-programacion.git
cd tu-repositorio
```

2- Instala las dependencias:
```bash
npm install
```

3-Configura las variables de entorno:
Crea un archivo .env en la raíz del proyecto con:
```bash
MONGODB_URI=mongodb://localhost:27017/nombre-de-tu-db
PORT=3000
```

🏃‍♂️ Ejecución
🛠️ Modo desarrollo
```bash
npm run dev
```

🚀 Modo producción
```bash
npm run build
npm run start
```
📚 Endpoints
🌤️ API del Clima
```
GET	/api/weather/	Obtener datos climáticos

POST	/api/weather/	Registrar datos climáticos	{ city, temperature, humidity, condition }

GET	/api/weather/history/:city	Historial por ciudad	

DELETE	/api/weather/:id	Eliminar registro
```

🌍 API de Terremotos
```
GET	/api/earthquake/	Obtener datos sísmicos

POST	/api/earthquake/	Registrar datos sísmicos	{ magnitude, depth, location, country }

GET	/api/earthquake/history/:country	Historial por país

DELETE	/api/earthquake/:id	Eliminar registro
```

📝 Ejemplos de Uso
Registrar dato climático
```
curl -X POST http://localhost:3000/api/weather \
  -H "Content-Type: application/json" \
  -d '{"city":"Lima","temperature":25,"humidity":60,"condition":"Soleado"}'
```
Obtener historial sísmico
```
curl http://localhost:3000/api/earthquake/history/Peru
```

🛠️ Tecnologías Utilizadas
Backend: Node.js, Express, TypeScript

Base de datos: MongoDB, Mongoose

Testing: Jest, Supertest

Documentación: Swagger (disponible en /api-docs)

📊 Estructura del Proyecto
```
src/
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
├── app.ts
└── server.ts
```
✉️ Contacto
Anthonny Baladi - asbaladi.19@est.ucab.edu.ve - anthonnysalim@gmail.com
