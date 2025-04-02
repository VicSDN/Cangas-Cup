import React from 'react';

interface ButtonModalProps {
  title: string;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
  title,
  formData,
  handleChange,
  handleSave,
  setIsEditing,
}) => {
  const closeModal = () => setIsEditing(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del equipo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Grupo</label>
            <input
              type="text"
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ButtonModal;
