// Importamos el módulo express, que es un framework para crear servidores en Node.js
const express = require('express');

// Creamos una aplicación de servidor utilizando la función express()
// Esta aplicación contendrá todas las rutas y lógica del servidor
const app = express();

// MiddleWare CORS
const cors = require('cors')
// Usar el middleware
app.use(cors())

// Comando para acceder a json-parser 
app.use(express.json())

// Definimos una lista de notas como un array de objetos, que simularemos como una base de datos en memoria
let notes = [
    {
        id: 1, // ID único de la nota (tipo número)
        content: "HTML is easy", // Contenido de la nota
        important: true // Indicador de si la nota es importante o no
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
];

// Definimos una ruta GET para la raíz del servidor ('/').
// Cuando un cliente haga una solicitud HTTP GET a la raíz, se ejecutará esta función de callback
app.get('/', (request, response) => {
    // Respondemos a la solicitud enviando un mensaje HTML simple al cliente
    response.send('<h1>Hello World!</h1>');
});

// Ruta para obtener todas las notas
app.get('/api/notes', (request, response) => {
    response.json(notes);
});

// Definimos otra ruta GET para acceder a una nota específica mediante su ID.
// La ruta incluye un parámetro de ruta dinámico `:id`, que se podrá capturar desde la URL.
app.get('/api/notes/:id', (request, response) => {
    // Extraemos el parámetro `id` de la solicitud, que viene como una cadena, y lo convertimos a un número
    const id = Number(request.params.id);

    // Buscamos en el array de notas la que tenga un `id` que coincida con el solicitado
    const note = notes.find(note => note.id === id);

    // Respondemos con el objeto JSON de la nota encontrada (si no existe, responderá con `null` o `undefined`)
    if(note) { // Si encuentra la nota responde con el estado Ok
        response.json(note);
    } else { // Si no la encuentra responde con el estado No found
        response.status(404).end()
    }
    
});

// Definimos otra ruta DELETE para eliminar un recursos mediante su ID
// La ruta incluye un parámetro de ruta dinámico `:id`, que se podrá capturar desde la URL.
// Definimos una ruta DELETE para eliminar un recurso mediante su ID
app.delete('/api/notes/:id', (request, response) => {
    // Extraemos el parámetro `id` de la solicitud, que viene como una cadena, y lo convertimos a un número
    const id = Number(request.params.id);

    // Filtramos las notas para excluir la nota con el ID proporcionado
    notes = notes.filter(note => note.id !== id);

    // Respondemos con el código de estado 204 No Content
    response.status(204).end();
});

// Función para generar un nuevo ID único para cada nota
const generateId = () => {
    // Si el array 'notes' tiene elementos, obtenemos el mayor ID existente
    const maxId = notes.length > 0
    // Creamos un array con los IDs de las notas y encontramos el mayor
      ? Math.max(...notes.map(n => n.id)) // El array se puede transformar en números individuales mediante el uso de la sintaxis de spread (tres puntos) 
      : 0; // Si el array está vacío, el mayor ID es 0
  
    // Retornamos el siguiente ID, asegurándonos de que sea único
    return maxId + 1;
  };
  
  // Ruta POST para crear una nueva nota
  app.post('/api/notes', (request, response) => {
    // Extraemos el cuerpo de la solicitud enviado por el cliente
    const body = request.body;
  
    // Validamos que el campo 'content' esté presente en la solicitud
    if (!body.content) {
      // Si falta el contenido, respondemos con un error 400 (Bad Request)
      return response.status(400).json({ 
        error: 'content missing' // Mensaje de error enviado al cliente
      });
    }
  
    // Creamos un nuevo objeto 'note' con los datos de la solicitud
    const note = {
      content: body.content, // El contenido de la nota viene del cuerpo de la solicitud
      important: Boolean(body.important) || false, // Convertimos el campo 'important' en booleano (por defecto false)
      id: generateId(), // Generamos un ID único para esta nota
    };
  
    // Agregamos la nueva nota al array existente de notas
    notes = notes.concat(note); // Usamos 'concat' para no modificar el array original directamente
  
    // Respondemos al cliente con la nota creada en formato JSON
    response.json(note);
  });

  // Middleware para manejo de errores
app.use((error, request, response, next) => {
  console.error(error.message);
  response.status(500).json({ error: 'Internal Server Error' });
});
  

// Definimos el puerto en el que nuestro servidor escuchará las solicitudes (USANDO RENDER O FLY.IO)
const PORT = process.env.PORT || 3001 // Servicio de Alojamiento en Línea

// Iniciamos el servidor para que comience a escuchar en el puerto definido
app.listen(PORT, () => {
    // Cuando el servidor se inicie correctamente, se imprimirá este mensaje en la consola
    console.log(`Server running on port ${PORT}`);
});






