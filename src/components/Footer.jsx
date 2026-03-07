import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Andorrax</h2>
          <p>
            Soluciones digitales modernas para empresas y proyectos innovadores.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Empresa</h4>
            <a href="/">Inicio</a>
            <a href="/servicios">Servicios</a>
            <a href="/sobre-nosotros">Sobre Nosotros</a>
          </div>

          <div>
            <h4>Recursos</h4>
            <a href="/blog">Blog</a>
            <a href="/contacto">Contacto</a>
            <a href="/soporte">Soporte</a>
          </div>

          <div>
            <h4>Legal</h4>
            <a href="/privacidad">Privacidad</a>
            <a href="/terminos">Términos</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>

        <div className="footer-contact">
          <h4>Contacto</h4>
          <p>📍 Andorra</p>
          <p>✉ info@andorrax.es</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Andorrax.es — Todos los derechos reservados
      </div>
    </footer>
  );
}