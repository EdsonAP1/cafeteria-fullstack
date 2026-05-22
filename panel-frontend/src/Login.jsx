import { useState } from 'react';

export function Login({ alLoguearse }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function manejarLogin(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, llena todos los campos');
      return;
    }

    // Hacemos el fetch a tu API real de Render
    fetch('https://cafeteria-fullstack.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Credenciales incorrectas o usuario inexistente');
      }
      return res.json();
    })
    .then((datos) => {
      // Guardamos el brazalete VIP (Token) en el disco duro del navegador
      localStorage.setItem('tokenCafeteria', datos.token);
      
      // Le avisamos a la aplicación que ya estamos dentro
      alLoguearse(datos.token);
    })
    .catch((err) => {
      setError(err.message);
    });
  }

  return (
    <div style={{ backgroundColor: '#2d2d2d', padding: '2rem', borderRadius: '8px', maxWidth: '350px', margin: '5rem auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2>Iniciar Sesión (Admin)</h2>
      {error && <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={manejarLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Correo Electrónico:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#0070f3', color: '#fff', width: '100%', padding: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Ingresar al Panel
        </button>
      </form>
    </div>
  );
}