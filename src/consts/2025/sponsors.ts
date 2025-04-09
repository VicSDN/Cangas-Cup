import type { Sponsors } from '../../types/Sponsors2025'

import Ayuntamiento from '../../assets/sponsors/Ayuntamiento.astro'


export const SPONSORS: Sponsors[] = [
  {
    id: 'Ayuntamiento',
    name: 'Ayuntamiento Cangas del Narcea',
    url: 'https://www.alsa.es/',
    label: 'Ir a la página web de Alsa',
    image: {
      logo: Ayuntamiento,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'baccara',
    name: 'Baccara',
    url: 'https://www.spotify.com/',
    label: 'Ir a la página web de Spotify',
    image: {
      logo: Ayuntamiento,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'asturtoner',
    name: 'Asturtoner',
    url: 'https://www.revolut.com/',
    label: 'Ir a la página web de Revolut',
    image: {
      logo: Ayuntamiento,
      width: 200,
      height: 200,
    },
  },
  /*
  {
    id: 'puntoycoma',
    name: 'Punto y Coma',
    url: 'https://www.vicio.com/',
    label: 'Ir a la página web de Vicio',
    image: {
      logo: Vicio,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'laabadia',
    name: 'La Abadía',
    url: 'https://www.cocacola.es/',
    label: 'Ir a la página web de Coca-Cola',
    image: {
      logo: CocaCola,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'refierta',
    name: 'Refierta',
    url: 'https://www.infojobs.net/',
    label: 'Ir a la página web de Infojobs',
    image: {
      logo: Infojobs,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'cajarural',
    name: 'Caja Rural',
    url: 'https://www.grefusa.com/',
    label: 'Ir a la página web de Grefusa',
    image: {
      logo: Grefusa,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'lozano',
    name: 'Transportes Lozano',
    url: 'https://www.nothing.tech/',
    label: 'Ir a la página web de Nothing',
    image: {
      logo: Nothing,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'javita',
    name: 'Javita',
    url: 'https://www.cerave.es/',
    label: 'Ir a la página web de Cerave',
    image: {
      logo: Cerave,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'manin',
    name: 'Manin',
    url: 'https://www.mahou.es/',
    label: 'Ir a la página web de Mahou',
    image: {
      logo: Mahou,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'goblet',
    name: 'Goblet',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'obradorflory',
    name: 'Obrador de Flory',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'lacasilla',
    name: 'La Casilla',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'energy',
    name: 'Energy',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'planb',
    name: 'Plan B',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'carpaselneno',
    name: 'Carpas El Neno',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'deportesacebo',
    name: 'Deportes Acebo',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'cafemadrid',
    name: 'Cafe Madrid',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'streetfood',
    name: 'Street Food',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'fornomanolo',
    name: 'Forno Manolo',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'barlacasera',
    name: 'Bar La Casera',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'cachican',
    name: 'Cachican',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'lablugo',
    name: 'La Blugo',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'bosque',
    name: 'Bosque',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'sidrerianarcea',
    name: 'Sidreria Narcea',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'varesport',
    name: 'Sidreria Narcea',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'varesport',
    name: 'Varesport',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'deportescarro',
    name: 'Deportescarro',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'barazul',
    name: 'Bar Azul',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'barmagadan',
    name: 'Bar Magadan',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'tiendaadela',
    name: 'Tienda Adela',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
  */
] as const