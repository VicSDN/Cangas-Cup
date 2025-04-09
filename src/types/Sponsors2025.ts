type SponsorId =
  | 'Ayuntamiento'
  | 'baccara'
  | 'asturtoner'
  | 'puntoycoma'
  | 'laabadia'
  | 'refierta'
  | 'cajarural'
  | 'lozano'
  | 'javita'
  | 'manin'
  | 'goblet'
  | 'obradorflory'
  | 'lacasilla'
  | 'energy'
  | 'planb'
  | 'vacio'
  | 'carpaselneno'
  | 'vacio2'
  | 'deportesacebo'
  | 'cafemadrid'
  | 'streetfood'
  | 'fornomanolo'
  | 'barlacasera'
  | 'cachican'
  | 'lablugo'
  | 'bosque'
  | 'sidrerianarcea'
  | 'varesport'
  | 'deportescarro'
  | 'asesoriaCGL'
  | 'barazul'
  | 'barmagadan'
  | 'tiendaadela';

type SponsorName =
  | 'Ayuntamiento Cangas del Narcea'
  | 'Baccara'
  | 'Asturtoner'
  | 'Punto y Coma'
  | 'La Abadía'
  | 'Refierta'
  | 'Caja Rural'
  | 'Transportes Lozano'
  | 'Javita'
  | 'Manin'
  | 'Goblet'
  | 'Obrador de Flory'
  | 'La Casilla'
  | 'Energy'
  | 'Plan B'
  | 'Vacio'
  | 'Carpas El Neno'
  | 'Vacio2'
  | 'Deportes Acebo'
  | 'Cafe Madrid'
  | 'Street Food'
  | 'Forno Manolo'
  | 'Bar La Casera'
  | 'Cachican'
  | 'La Blugo'
  | 'Bosque'
  | 'Sidreria Narcea'
  | 'Varesport'
  | 'AsesoriaCGL'
  | 'Deportescarro'
  | 'Bar Azul'
  | 'Bar Magadan'
  | 'Tienda Adela';

  export interface Sponsors {
    id: SponsorId
    name: SponsorName
    url: string
    label: string
    image: {
      logo: any
      width: number
      height: number
    }
  }
