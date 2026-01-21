import { User } from './types';

export const CURRENT_USER: User = {
  name: 'Ventolini Cali',
  role: 'Plan Enterprise',
  company: 'Ventolini',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
};

import { Wand2, Smile } from 'lucide-react';

export const MOCK_INSIGHTS = [
  {
    type: 'insight',
    text: '"Espero que te haya ido bien con la apertura del nuevo restaurante en Cali. Los datos iniciales muestran un gran interés en la zona."',
    icon: Wand2,
    label: 'INSIGHT PERSONALIZADO'
  },
  {
    type: 'sentiment',
    text: '"Tu nuevo sabor de helados de fresa con arándanos está teniendo excelentes comentarios, me gustaría probarlo personalmente."',
    icon: Smile,
    label: 'SENTIMIENTO DE AUDIENCIA'
  }
];

export const CONTENT_RESULTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    title: 'Helado Artesanal',
    copy: 'Descubre la magia de nuestro nuevo helado de chocolate belga, una explosión de sabor en cada bocado.',
    hashtags: '#Ventolini #HeladoArtesanal #Chocolate',
    music: 'Sweet Jazz Vibes',
    tag: 'MÁS PRECISO',
    tagColor: 'bg-emerald-500'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    title: 'Tarta de Chocolate',
    copy: 'El equilibrio perfecto entre suavidad y sabor en cada bocado de nuestra pastelería premium.',
    hashtags: '#Ventolini #Pasteleria #Gourmet',
    music: 'Elegant Waltz',
    tag: 'TENDENCIA',
    tagColor: 'bg-amber-500'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    title: 'Batido Deluxe',
    copy: 'Haz de tu tarde una experiencia inolvidable con nuestro maridaje perfecto de café y chocolate.',
    hashtags: '#CoffeeTime #Ventolini #Deluxe',
    music: 'Morning Acoustic',
    tag: 'NUEVO',
    tagColor: 'bg-orange-500'
  }
];
