import { useEffect, useState } from 'react';

interface Team {
  id: string;
  name: string;
  group_id: string | number;
  location: string;
}

interface EditButtonProps {
  data: Team;
}

export default function EditButton({ data }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);
  const [formData, setFormData] = useState<Team>({
    ...data,
    group_id: String(data.group_id),
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'points' ? parseInt(value) || 0 : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'El nombre es obligatorio';
    if (!String(formData.group_id).trim()) return 'El grupo es obligatorio';
    if (!formData.location.trim()) return 'La localización es obligatoria';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch(`/api/team/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          group_id: String(formData.group_id),
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Error al actualizar el equipo';

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const text = await response.text();
          if (response.status === 404) {
            errorMessage = 'API endpoint no encontrado';
          } else {
            errorMessage = `Error ${response.status}: ${text.slice(0, 100)}...`;
          }
        }
        throw new Error(errorMessage);
      }

      setOpen(false);
      setShouldReload(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  useEffect(() => {
    if (!open && shouldReload) {
      location.reload();
    }
  }, [open, shouldReload]);

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

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                name="name"
                value={formData.name ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Grupo</label>
              <input
                name="group_id"
                value={formData.group_id ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Localización</label>
              <input
                name="location"
                value={formData.location ?? ''}
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
