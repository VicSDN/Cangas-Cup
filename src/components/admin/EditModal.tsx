// src/components/admin/EditModal.tsx
import React, { useState } from 'react';
import { Team, updateTeam } from '../../lib/teamService';  // Importa la interfaz y las funciones

interface EditModalProps {
  teamData: Team;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ teamData, onClose }) => {
  const [formData, setFormData] = useState<Team>(teamData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTeam = await updateTeam(formData.id, formData);
    if (updatedTeam) {
      alert('Equipo actualizado con éxito');
      onClose();
    } else {
      alert('Hubo un error al actualizar el equipo');
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Grupo:
          <input
            type="text"
            name="group_id"
            value={formData.group_id}
            onChange={handleChange}
          />
        </label>
        <label>
          Año:
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditModal;
