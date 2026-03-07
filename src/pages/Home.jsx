import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../components/footer";
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Detectar scroll para botón scroll-to-top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) setShowScrollTop(true);
      else setShowScrollTop(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setMenuAbierto(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegación a otras páginas (simuladas)
  const goToLogin = () => navigate('./login');

  const destinosDestacados = [
    {
      id: 1,
      nombre: 'Grandvalira',
      descripcion: 'El dominio esquiable más grande del sur de Europa',
      imagen: 'https://images.unsplash.com/photo-1520406485517-2ebc08a442f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      precio: 'Desde 45€/día'
    },
    {
      id: 2,
      nombre: 'Caldea',
      descripcion: 'El centro termal más grande del sur de Europa',
      imagen: 'https://images.unsplash.com/photo-1540555700478-4be289fbe4ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      precio: 'Desde 35€/persona'
    },
    {
      id: 3,
      nombre: 'Vallnord',
      descripcion: 'Paraíso para los amantes de la montaña',
      imagen: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      precio: 'Desde 40€/día'
    }
  ];

  const actividades = [
    {
      icono: '⛷️',
      titulo: 'Esquí y Snowboard',
      descripcion: 'Disfruta de las mejores pistas de los Pirineos',
      imagen: 'https://images.unsplash.com/photo-1520406485517-2ebc08a442f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    {
      icono: '🥾',
      titulo: 'Senderismo',
      descripcion: 'Rutas para todos los niveles en plena naturaleza',
      imagen: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    {
      icono: '♨️',
      titulo: 'Bienestar',
      descripcion: 'Relájate en aguas termales y spas',
      imagen: 'https://images.unsplash.com/photo-1540555700478-4be289fbe4ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    {
      icono: '🛍️',
      titulo: 'Shopping',
      descripcion: 'Compras libres de impuestos en Andorra la Vella',
      imagen: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    {
      icono: '🍽️',
      titulo: 'Gastronomía',
      descripcion: 'Saborea la mejor cocina de montaña',
      imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    {
      icono: '🏰',
      titulo: 'Cultura',
      descripcion: 'Descubre el patrimonio histórico andorrano',
      imagen: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    }
  ];

  return (
    <div className="home">

      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="logo-container" onClick={() => scrollToSection('inicio')}>
            <div className="logo-placeholder">🇦🇩</div>
            <span className="site-title">AndorraX</span>
          </div>

          <button 
            className={`menu-hamburguesa ${menuAbierto ? 'activo' : ''}`}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-menu ${menuAbierto ? 'activo' : ''}`}>
            <li><a onClick={() => scrollToSection('inicio')}>Inicio</a></li>
            <li><a onClick={() => scrollToSection('destinos')}>Destinos</a></li>
            <li><a onClick={() => scrollToSection('actividades')}>Actividades</a></li>
            <li><a onClick={() => scrollToSection('contacto')}>Contacto</a></li>
            <li><button className="btn-login" onClick={goToLogin}>Iniciar sesión</button></li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero" id="inicio">
        <div className="hero-contenido">
          <h1>Descubre Andorra</h1>
          <p>Un país de montañas, nieve y naturaleza en el corazón de los Pirineos</p>
        </div>
      </section>

      {/* Destinos */}
      <section className="destacados" id="destinos">
        <h2 className="section-titulo">Destinos Destacados</h2>
        <p className="section-subtitulo">Los lugares más emblemáticos que no te puedes perder</p>
        <button
        className="btn-hoteles"
        onClick={() => navigate("/hoteles")}
      >
        Ver Hoteles
      </button>
        <div className="destinos-grid">
          {destinosDestacados.map(destino => (
            <div key={destino.id} className="destino-card">
              <div className="destino-imagen">
                <img src={destino.imagen} alt={destino.nombre} />
                <span className="destino-precio">{destino.precio}</span>
              </div>
              <div className="destino-info">
                <h3>{destino.nombre}</h3>
                <p>{destino.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actividades */}
      <section className="actividades" id="actividades">
        <h2 className="section-titulo">Actividades para Todos</h2>
        <p className="section-subtitulo">Encuentra la actividad perfecta para tu viaje</p>
        <div className="actividades-grid">
          {actividades.map((actividad, index) => (
            <div key={index} className="actividad-card">
              <div className="actividad-icono">{actividad.icono}</div>
              <h3>{actividad.titulo}</h3>
              <p>{actividad.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />


      {/* Scroll to top */}
      <button 
        className={`scroll-indicator ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>

    </div>
  );
};

export default Home;