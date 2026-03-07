import "./HotelesModal.css";

const HotelesModal = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <h2>Hoteles Destacados</h2>

        <ul>
          <li>Hotel Playa Paraíso - Cancún</li>
          <li>Hotel Montaña Mágica - Chile</li>
          <li>Hotel Bosque Encantado - Costa Rica</li>
          <li>Hotel Ciudad Maravilla - Barcelona</li>
          <li>Hotel Oasis Urbano - Nueva York</li>
        </ul>

        <button
          className="btn btn-secundario"
          onClick={onClose}
        >
          Cerrar
        </button>

      </div>

    </div>

  );
};

export default HotelesModal;