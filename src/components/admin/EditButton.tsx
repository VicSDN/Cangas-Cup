import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; 
import ButtonModal from './ButtonModal';

interface EditButtonProps {
  type: string;
  data: any; 
}

const EditButton: React.FC<EditButtonProps> = ({ type, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: updatedTeam, error } = await supabase
      .from('tournament_team')
      .update(formData)
      .eq('id', formData.id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar el equipo:', error.message);
      return;
    }

    console.log('Equipo actualizado:', updatedTeam);
    setIsEditing(false); // Cerrar el modal
  };

  return (
    <div>
      {isEditing ? (
        <ButtonModal
          title={`Editar ${type}`}
          formData={formData}
          handleChange={handleChange}
          handleSave={handleSave}
          setIsEditing={setIsEditing} // Pasar función para cerrar el modal
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Editar {type}
        </button>
      )}
    </div>
  );
};

export default EditButton;
