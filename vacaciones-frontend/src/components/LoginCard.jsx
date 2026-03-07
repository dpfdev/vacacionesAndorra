import { useState } from 'react';
import './login.css';

const AndorraLogin = () => {
  const [email, setEmail] = useState('hola@andorraesqui.com');
  const [password, setPassword] = useState('12345678');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login intent with:', { email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* PANEL IZQUIERDO - IMAGEN DE NIEVE Y ESQUÍ */}
        <div 
          className="brand-panel"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 50, 80, 0.7), rgba(0, 30, 60, 0.8)), 
            url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1000&auto=format&fit=crop')`
          }}
        >
          <div className="brand-content">
            <div className="logo-area">
              <div className="logo-icon">
                <i className="fas fa-skiing"></i>
              </div>
              <span>Andorra<span className="logo-accent">❄️</span>Snow</span>
            </div>
            
            <h1 className="brand-title">
              Esquía en la <span className="brand-highlight">nieve</span><br />de los Pirineos
            </h1>
            
            <ul className="feature-list">
              <li><i className="fas fa-check-circle"></i> Grandvalira · 210km de pistas</li>
              <li><i className="fas fa-check-circle"></i> Vallnord · Pal Arinsal</li>
              <li><i className="fas fa-check-circle"></i> Clases de esquí y snow</li>
              <li><i className="fas fa-check-circle"></i> Après-ski · Gastronomía</li>
            </ul>

            {/* Testimonio esquiador */}
            <div className="testimonial">
              <p>"Las mejores pistas de los Pirineos. Nieve garantizada."</p>
              <div className="author">
                <div 
                  className="author-img"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&auto=format&fit=crop')`
                  }}
                ></div>
                <div className="author-info">
                  <span className="author-name">Carlos Martínez</span>
                  <span className="author-title">Esquiador · 15 temporadas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="location-tag">
            <i className="fas fa-map-pin"></i> Grandvalira · Andorra
          </div>
        </div>

        {/* PANEL DERECHO - TONOS AZULES */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Bienvenido esquiador</h2>
            <p>
              <i className="fas fa-snowflake"></i> 
              Accede a tu forfait digital
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                placeholder="tú@andorraesqui.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Recordar mis datos
              </label>
              <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>¿Olvidaste?</a>
            </div>

            <button type="submit" className="btn-login">
              <span>Iniciar sesión</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          <div className="alternative-login">
            <p>o continúa con</p>
            <div className="social-icons">
              <a href="#" aria-label="Google" onClick={(e) => e.preventDefault()}><i className="fab fa-google"></i></a>
              <a href="#" aria-label="Apple" onClick={(e) => e.preventDefault()}><i className="fab fa-apple"></i></a>
              <a href="#" aria-label="Facebook" onClick={(e) => e.preventDefault()}><i className="fab fa-facebook-f"></i></a>
            </div>
          </div>

          <div className="signup-prompt">
            ¿Nuevo en las pistas? <a href="#" onClick={(e) => e.preventDefault()}>Regístrate</a>
          </div>
           <input className="btn-back" onClick={() => window.history.back()} type="button" value="Volver" />
        </div>
       
      </div>
      
    </div>
  );
};

export default AndorraLogin;