// src/components/admin/EditButton.tsx
import { useState } from 'react';
import EditModal from './EditModal';

interface EditButtonProps {
  type: string;  // Puede ser "team", "player", etc.
  data: any;     // Los datos que se editarán, como el equipo o jugador
}

const EditButton: React.FC<EditButtonProps> = ({ type, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="w-full bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600"
      >
        Editar {type}
      </button>

      {isModalOpen && (
        <EditModal
          type={type}
          data={data}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default EditButton;
