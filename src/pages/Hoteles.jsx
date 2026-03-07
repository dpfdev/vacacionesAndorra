import "../styles/HotelesModal.css";

export default function HotelesModal({ onClose }) {
  // Ejemplo de datos de hoteles, puedes reemplazar con tus datos reales
  const hoteles = [
    {
      nombre: "Hotel Grandvalira",
      imagen: "/src/assets/imagenes/grandvalira.jpg",
      descripcion: "Con vistas increíbles a las pistas de esquí.",
    },
    {
      nombre: "Hotel Vallnord",
      imagen: "/src/assets/imagenes/vallnord.jpg",
      descripcion: "Ideal para familias y actividades al aire libre.",
    },
    {
      nombre: "Hotel Naturland",
      imagen: "/src/assets/imagenes/naturland.jpg",
      descripcion: "Comodidad y naturaleza en un solo lugar.",
    },
  ];

  return (
    <div className="hoteles-modal-backdrop">
      <div className="hoteles-modal">
        <div className="hoteles-modal-header">
          <h2>Hoteles Destacados</h2>
          <button className="hoteles-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="hoteles-grid">
          {hoteles.map((hotel, index) => (
            <div key={index} className="hotel-card">
              <img src={hotel.imagen} alt={hotel.nombre} className="hotel-img" />
              <h3>{hotel.nombre}</h3>
              <p>{hotel.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
