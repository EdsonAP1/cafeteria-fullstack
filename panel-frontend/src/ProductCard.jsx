// src/ProductCard.jsx
import { useState } from 'react';

// Agregamos la palabra "export" al inicio de la función para que otros archivos puedan usarla
export function ProductCard(props) {
  const [cantidad, setCantidad] = useState(0);

  function incrementar() {
    setCantidad(cantidad + 1);
  }

  function decremento() {
    if (cantidad > 0) {
      setCantidad(cantidad - 1);
    }
  }

  return (
    <div style={{ border: '1px solid #444', padding: '1rem', margin: '1rem', borderRadius: '8px', maxWidth: '300px' }}>
      <h2>{props.nombre}</h2>
      <p>{props.descripcion}</p>
      <strong>Bs. {props.precio}</strong>
      
      <div style={{ marginTop: '1rem' }}>
        <p>Cantidad seleccionada: <strong>{cantidad}</strong></p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={incrementar} style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Agregar +1
          </button>
          <button onClick={decremento} style={{ padding: '0.5rem 1rem', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Quitar -1
          </button>
        </div>
      </div>
    </div>
  );
}