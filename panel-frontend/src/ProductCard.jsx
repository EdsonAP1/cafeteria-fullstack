export function ProductCard({ id, nombre, descripcion, precio, alEliminar, alEditar }) {
  return (
    <div style={{
      backgroundColor: '#2d2d2d',
      border: '1px solid #444',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem',
      width: '200px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{nombre}</h3>
        <p style={{ fontSize: '0.9rem', color: '#aaa', minHeight: '40px', margin: '0 0 1rem 0' }}>{descripcion}</p>
      </div>
      
      <div>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4caf50', margin: '0 0 1rem 0' }}>
          {precio} Bs.
        </p>
        
        {/* FILA DE BOTONES DE ACCIÓN */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* BOTÓN AZUL DE EDICIÓN */}
          <button 
            onClick={() => alEditar({ id, nombre, descripcion, precio })} 
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem',
              flex: 1,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Editar✏️
          </button>

          {/* BOTÓN ROJO DE ELIMINAR */}
          <button 
            onClick={() => alEliminar(id)} 
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem',
              flex: 1,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Borrar🗑️
          </button>
        </div>
      </div>
    </div>
  );
}