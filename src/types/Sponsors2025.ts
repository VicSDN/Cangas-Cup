type SponsorId =
  | 'Ayuntamiento'
  | 'baccara'
  | 'asturtoner'
  | 'puntoycoma'
  | 'laabadia'
  | 'refierta'
  | 'lozano'
  | 'javita'
  | 'manin'
  | 'goblet'
  | 'obradorflory'
  | 'lacasilla'
  | 'energy'
  | 'planb'
  | 'streetfood'
  | 'bosque'
  | 'sidrerianarcea'
  | 'barazul'
  | 'excalex'
  | 'casafarruco'
  | 'parla'
  | 'ingenegreen'
  | 'zaira';

type SponsorName =
  | 'Ayuntamiento Cangas del Narcea'
  | 'Baccara'
  | 'Asturtoner'
  | 'Punto y Coma'
  | 'La Abadía'
  | 'Refierta'
  | 'Transportes Lozano'
  | 'Javita'
  | 'Manin'
  | 'Goblet'
  | 'Obrador de Flory'
  | 'La Casilla'
  | 'Energy'
  | 'Plan B'
  | 'Street Food'
  | 'Bosque'
  | 'Sidreria Narcea'
  | 'Bar Azul'
  | 'Excalex'
  | 'Casa Farruco'
  | 'Parla'
  | 'Ingenegreen'
  | 'Zaira';

export interface Sponsors {
  id: SponsorId;
  name: SponsorName;
  url: string;
  label: string;
  image: {
    logo: any;
    width: number;
    height: number;
  };
}
