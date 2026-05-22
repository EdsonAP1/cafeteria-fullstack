import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Login } from './Login'; // 1. IMPORTAMOS EL NUEVO COMPONENTE

function App() {
  const [menuProductos, setMenuProductos] = useState([]);
  
  // 2. ESTADO DEL TOKEN: Lee si ya había un brazalete VIP guardado de antes
  const [token, setToken] = useState(localStorage.getItem('tokenCafeteria') || '');

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  function cargarProductos() {
    // La lectura de productos sigue siendo pública para cualquier cliente
    fetch('https://cafeteria-fullstack.onrender.com/api/productos')
      .then((res) => res.json())
      .then((datos) => setMenuProductos(datos));
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  // FUNCIÓN DE ENVÍO POST CON CANDADO
  function manejarEnvio(e) {
    e.preventDefault();

    if (!nombre || !descripcion || !precio) {
      alert("Por favor, llena todos los campos");
      return;
    }

    const nuevoItem = {
      nombre: nombre,
      descripcion: descripcion,
      precio: Number(precio)
    };

    // Hacemos el fetch al servidor real de Render
    fetch('https://cafeteria-fullstack.onrender.com/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 3. ¡ENVIAMOS EL TOKEN EN EL ENCABEZADO! Así pasamos la aduana del Middleware
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevoItem)
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("No tienes autorización para realizar esta acción. Inicia sesión de nuevo.");
      }
      return res.json();
    })
    .then(() => {
      cargarProductos();
      setNombre('');
      setDescripcion('');
      setPrecio('');
    })
    .catch((err) => alert(err.message));
  }

  // FUNCIÓN PARA CERRAR SESIÓN (Quita el token de la memoria)
  function cerrarSesion() {
    localStorage.removeItem('tokenCafeteria');
    setToken('');
  }

  // 4. CONDICIONAL DE SEGURIDAD: Si no hay token, lo frena en el Login
  if (!token) {
    return <Login alLoguearse={(tokenGenerado) => setToken(tokenGenerado)} />;
  }

  // 5. RUTA PROTEGIDA: Si hay token, renderiza la app normal de administración
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', backgroundColor: '#1e1e1e', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Panel de Administración - Cafetería</h1>
        <button onClick={cerrarSesion} style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Cerrar Sesión
        </button>
      </div>
      
      {/* VISTA DEL FORMULARIO */}
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
          Guardar Producto Seguro
        </button>
      </form>

      <hr style={{ borderColor: '#444', marginBottom: '2rem' }} />

      <h2>Menú Disponible (Datos en Vivo)</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {menuProductos.map((producto) => (
          <ProductCard 
            key={producto.id}
            nombre={producto.nombre} 
            descripcion={producto.descripcion} 
            precio={Number(producto.precio)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;