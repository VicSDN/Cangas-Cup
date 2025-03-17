// src/components/AddTeamForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

interface TeamData {
  name: string;
  group_id: number;
  year: number;
}

const AddTeamForm = () => {
  const [name, setName] = useState<string>('');
  const [group, setGroup] = useState<number | string>('');
  const [year, setYear] = useState<number | string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const teamData: TeamData = {
      name,
      group_id: Number(group),
      year: Number(year),
    };

    try {
      const { data, error } = await supabase.from('tournament_team').insert([teamData]);
      if (error) {
        console.error('Error adding team:', error.message);
      } else {
        console.log('Team added successfully:', data);
      }
    } catch (error: any) {
      console.error('Error during the insertion:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="group">Grupo</label>
        <input
          id="group"
          name="group"
          type="number"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="year">Año</label>
        <input
          id="year"
          name="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default AddTeamForm;
