import { useState } from "react";

interface Team {
  id: string;
  name: string;
  group_id: string;
  location: string;
  points: number;
}

interface EditButtonProps {
  data: Team;
  onSuccess: () => void;
}

export default function EditButton({ data, onSuccess }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Team>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "points" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const response = await fetch(`/api/team/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.error("Error al actualizar:", await response.text());
    } else {
      onSuccess();
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Editar equipo
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Editar equipo</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                name="name"
                value={formData.name ?? ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Grupo
              </label>
              <input
                name="group_id"
                value={formData.group_id ?? ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Localización
              </label>
              <input
                name="location"
                value={formData.location ?? ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Puntos
              </label>
              <input
                type="number"
                name="points"
                value={formData.points ?? 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
