import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro'; 

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_KEY!
);

function formatDateToICS(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function escapeICSText(text: string | null | undefined): string {
  if (text === null || text === undefined) {
    return '';
  }
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n'); 
}

export const GET: APIRoute = async () => {
  type Team = { name: string | null };
  type Match = {
    id: number;
    match_date: string; 
    match_duration_minutes?: number;
    home_score?: number | null;
    away_score?: number | null;
    match_label?: string | null;
    match_stage?: string | null;
    updated_at?: string | null;
    location_name?: string | null;
    location_Maps_url?: string | null;
    home_team?: Team | null;
    away_team?: Team | null;
  };

  const { data: matches, error } = (
    await supabase
      .from('tournament_match')
      .select(`
        id,
        match_date,
        home_score,
        away_score,
        match_label,
        match_stage,
        updated_at,
        home_team(name),
        away_team(name)
      `)
      .order('match_date', { ascending: true })
  ) as { data: Match[] | null, error: any };

  if (error) {
    console.error('Error fetching matches from Supabase:', error);
    return new Response(JSON.stringify({ message: 'Error fetching matches', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!matches) {
    return new Response(JSON.stringify({ message: 'No matches found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CangasCup2025//Calendario de Partidos//ES', 
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Madrid',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19810329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19811025T030000', 
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE'
  ];

  for (const match of matches) {
    if (!match.match_date) continue;
    const start = new Date(match.match_date); 
    
    const durationMinutes = match.match_duration_minutes || 50;
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const dtstart = formatDateToICS(start);
    const dtend = formatDateToICS(end);
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; 
    const lastModified = new Date(match.updated_at || match.match_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; 

    const homeTeamName = match.home_team && typeof match.home_team === 'object' && 'name' in match.home_team
      ? escapeICSText(match.home_team.name as string)
      : 'Por definir';

    const awayTeamName = match.away_team && typeof match.away_team === 'object' && 'name' in match.away_team
      ? escapeICSText(match.away_team.name as string)
      : 'Por definir';

    const summary = `${homeTeamName} vs ${awayTeamName}`;

    const descriptionParts = [];
    if (match.match_label) {
      descriptionParts.push(`Categoría/Grupo: ${escapeICSText(match.match_label)}`);
    }
    if (match.match_stage) {
      descriptionParts.push(`Fase: ${escapeICSText(match.match_stage)}`);
    }
    if (match.home_score != null && match.away_score != null) {
      descriptionParts.push(`Resultado: ${homeTeamName} ${match.home_score} - ${match.away_score} ${awayTeamName}`);
    } else {
      descriptionParts.push(`Resultado pendiente`);
    }
    const description = descriptionParts.join('\\n');

    const locationName = match.location_name || 'Polideportivo Municipal Cangas del Narcea';
    const location = escapeICSText(locationName);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:match-${match.id}@cangascup2025.com`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART;TZID=Europe/Madrid:${dtstart}`); 
    lines.push(`DTEND;TZID=Europe/Madrid:${dtend}`);
    lines.push(`LAST-MODIFIED:${lastModified}`);
    lines.push(`SEQUENCE:${Math.floor(new Date(match.updated_at || match.match_date).getTime() / 1000)}`); 
    lines.push(`SUMMARY:${summary}`);
    if (description) {
      lines.push(`DESCRIPTION:${description}`);
    }
    if (location) {
      lines.push(`LOCATION:${location}`);
    }
    lines.push('BEGIN:VALARM');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Recordatorio: ${summary}`);
    lines.push('TRIGGER:-PT1H');
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  return new Response(lines.join('\r\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="cangascup2025-calendario.ics"',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
};