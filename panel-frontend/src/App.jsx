import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Login } from './Login'; 

function App() {
  const [menuProductos, setMenuProductos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('tokenCafeteria') || '');

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const [listaCategorias, setListaCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  // Estado para saber qué producto estamos editando. Si está vacío (null), estamos creando.
  const [idProductoEditando, setIdProductoEditando] = useState(null);

  // ¡NUEVO! Estado para capturar el archivo físico de la imagen seleccionada
  const [imagenArchivo, setImagenArchivo] = useState(null);

  function cargarProductos() {
    fetch('http://localhost:3000/api/productos')
      .then((res) => res.json())
      .then((datos) => setMenuProductos(datos));
  }

  function cargarCategorias() {
    fetch('http://localhost:3000/api/categorias')
      .then((res) => res.json())
      .then((datos) => setListaCategorias(datos))
      .catch((err) => console.error("Error al traer categorías:", err));
  }

  useEffect(() => {
    cargarProductos();
    cargarCategorias(); 
  }, []);

  // 1. FUNCIÓN DE ENVÍO OPTIMIZADA PARA MULTIPART/FORM-DATA (IMÁGENES BINARIAS)
  function manejarEnvio(e) {
    e.preventDefault();

    if (!nombre || !descripcion || !precio) {
      alert("Por favor, llena todos los campos");
      return;
    }

    // ¡CAMBIO CLAVE! Dejamos JSON y empaquetamos todo en FormData nativo
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', Number(precio));
    
    if (categoriaSeleccionada) {
      formData.append('categoria_id', Number(categoriaSeleccionada));
    }
    
    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo); // El nombre "imagen" lo espera Multer en el backend
    }

    const esEdicion = idProductoEditando !== null;
    const url = esEdicion 
      ? `http://localhost:3000/api/productos/${idProductoEditando}` 
      : 'http://localhost:3000/api/productos';
    const metodoHttp = esEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodoHttp,
      headers: {
        // NOTA IMPORTANTE: Con FormData NO debes poner 'Content-Type': 'application/json'. 
        // El navegador configurará los límites binarios automáticamente.
        'Authorization': `Bearer ${token}`
      },
      body: formData // Enviamos el paquete físico
    })
    .then((res) => {
      if (!res.ok) throw new Error("Error al procesar la solicitud en el servidor.");
      return res.json();
    })
    .then(() => {
      cargarProductos(); 
      
      // Limpiamos los campos y salimos del modo edición
      setIdProductoEditando(null);
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setCategoriaSeleccionada(''); 
      setImagenArchivo(null); // <-- ¡NUEVO! Limpiamos el selector de archivos
    })
    .catch((err) => alert(err.message));
  }

  // 2. FUNCIÓN PARA ELIMINAR
  function eliminarProducto(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    })
    .then((res) => {
      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      return res.json();
    })
    .then(() => {
      cargarProductos(); 
    })
    .catch((err) => alert(err.message));
  }

  // FUNCIÓN PARA PREPARAR EL FORMULARIO PARA EDICIÓN
  function seleccionarProductoParaEditar(producto) {
    setIdProductoEditando(producto.id); 
    setNombre(producto.nombre);         
    setDescripcion(producto.descripcion); 
    setPrecio(producto.precio);         
    setCategoriaSeleccionada(producto.categoria_id || ''); 
  }

  // FUNCIÓN PARA CERRAR SESIÓN
  function cerrarSesion() {
    localStorage.removeItem('tokenCafeteria');
    setToken('');
  }

  // CONDICIONAL DE SEGURIDAD
  if (!token) {
    return <Login alLoguearse={(tokenGenerado) => setToken(tokenGenerado)} />;
  }

  // RENDERIZADO DEL PANEL
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
        <h3>{idProductoEditando ? 'Editar Producto Seleccionado' : 'Agregar Nuevo Producto'}</h3>
        
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.2rem' }}>Categoría Relacionada:</label>
          <select 
            value={categoriaSeleccionada} 
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          >
            <option value="">-- Selecciona una categoría --</option>
            {listaCategorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* ¡NUEVO! CONTROL COMPONENTE COMPLETO DE IMAGEN */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.2rem' }}>Imagen del Producto:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImagenArchivo(e.target.files[0])} // Guarda el archivo seleccionado
            style={{ width: '100%', color: '#fff' }} 
          />
        </div>

        <button type="submit" style={{ backgroundColor: idProductoEditando ? '#eab308' : '#0070f3', color: 'white', padding: '0.7rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
          {idProductoEditando ? '⚡ Actualizar Cambios' : '➕ Guardar Producto Seguro'}
        </button>
      </form>

      <hr style={{ borderColor: '#444', marginBottom: '2rem' }} />

      <h2>Menú Disponible (Datos en Vivo)</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {menuProductos.map((producto) => (
          <ProductCard 
            key={producto.id}
            id={producto.id} 
            nombre={producto.nombre} 
            descripcion={producto.descripcion} 
            precio={Number(producto.precio)}
            categoria_id={producto.categoria_id} 
            alEliminar={eliminarProducto} 
            alEditar={seleccionarProductoParaEditar}
          />
        ))}
      </div>
    </div>
  );
}

export default App;