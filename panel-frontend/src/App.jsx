// src/App.jsx (Frontend completo)
import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

function App() {
  const [menuProductos, setMenuProductos] = useState([]);

  // 1. ESTADOS DEL FORMULARIO: Para capturar lo que escribe el usuario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  // Función para traer los productos del backend (la envolvemos para poder reutilizarla)
  function cargarProductos() {
    fetch('https://cafeteria-fullstack.onrender.com/api/productos')
      .then((res) => res.json())
      .then((datos) => setMenuProductos(datos));
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  // 2. FUNCIÓN DE ENVÍO POST
  function manejarEnvio(e) {
    e.preventDefault(); // Evita que la página se recargue por completo

    // Validamos que los campos no estén vacíos
    if (!nombre || !descripcion || !precio) {
      alert("Por favor, llena todos los campos");
      return;
    }

    // Creamos el objeto que enviaremos en el body
    const nuevoItem = {
      nombre: nombre,
      descripcion: descripcion,
      precio: Number(precio) // Convertimos el texto del input a número estricto
    };

    // Hacemos el fetch configurado en modo POST
    fetch('https://cafeteria-fullstack.onrender.com/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Le avisamos al backend que le va un JSON
      },
      body: JSON.stringify(nuevoItem) // Convertimos el objeto de JS a texto plano JSON
    })
    .then((res) => res.json())
    .then(() => {
      // Una vez guardado con éxito en el servidor:
      cargarProductos(); // 3. Refrescamos la pantalla volviendo a consultar la API
      
      // Limpiamos los cajones del formulario para un nuevo registro
      setNombre('');
      setDescripcion('');
      setPrecio('');
    });
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', backgroundColor: '#1e1e1e', color: '#fff', minHeight: '100vh' }}>
      <h1>Panel de Administración - Cafetería</h1>
      
      {/* 4. VISTA DEL FORMULARIO */}
      <form onSubmit={manejarEnvio} style={{ backgroundColor: '#2d2d2d', padding: '1.5rem', borderRadius: '8px', maxWidth: '400px', marginBottom: '2rem' }}>
        <h3>Agregar Nuevo Producto</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Descripción:</label>
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Precio (Bs.):</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.7rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Guardar Producto en Servidor
        </button>
      </form>

      <hr style={{ borderColor: '#444', marginBottom: '2rem' }} />

      <h2>Menú Disponible (Datos en Vivo)</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {menuProductos.map((producto) => {
          return (
            <ProductCard 
              key={producto.id}
              nombre={producto.nombre} 
              descripcion={producto.descripcion} 
              precio={Number(producto.precio)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;