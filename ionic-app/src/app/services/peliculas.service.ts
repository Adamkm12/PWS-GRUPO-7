import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, getDocs, addDoc, writeBatch, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Pelicula {
  id: string;
  titulo: string;
  director: string;
  genero: string;
  anio: number;
  puntuacion: number;
  sinopsis: string;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class PeliculasService {
  private db = inject(Firestore);

  // Obtiene todas las películas de Firestore en tiempo real
  getAll(): Observable<Pelicula[]> {
    return collectionData(collection(this.db, 'peliculas'), { idField: 'id' }) as Observable<Pelicula[]>;
  }

  // Obtiene el detalle de una película por ID desde Firestore
  getById(id: string): Observable<Pelicula> {
    return docData(doc(this.db, 'peliculas', id), { idField: 'id' }) as Observable<Pelicula>;
  }

  // Puebla Firestore con el catálogo completo.
  // Si ya hay películas pero faltan algunas, borra todo y vuelve a insertar.
  async seed() {
    const snap = await getDocs(collection(this.db, 'peliculas'));

    const datos: Omit<Pelicula, 'id'>[] = [
      // ── Clásicos originales ──
      {
        titulo: 'Inception',
        director: 'Christopher Nolan',
        genero: 'Ciencia Ficción',
        anio: 2010,
        puntuacion: 8.8,
        sinopsis: 'Un ladrón que roba secretos corporativos mediante el uso de la tecnología de compartir sueños recibe la tarea inversa de plantar una idea en la mente de un CEO.',
        imagen: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80'
      },
      {
        titulo: 'Interstellar',
        director: 'Christopher Nolan',
        genero: 'Aventura',
        anio: 2014,
        puntuacion: 8.6,
        sinopsis: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de garantizar la supervivencia de la humanidad.',
        imagen: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80'
      },
      {
        titulo: 'The Dark Knight',
        director: 'Christopher Nolan',
        genero: 'Acción',
        anio: 2008,
        puntuacion: 9.0,
        sinopsis: 'Batman enfrenta al Joker, un criminal caótico que quiere sumir Gotham City en la anarquía total.',
        imagen: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&q=80'
      },
      {
        titulo: 'Parasite',
        director: 'Bong Joon-ho',
        genero: 'Drama',
        anio: 2019,
        puntuacion: 8.5,
        sinopsis: 'La familia Kim, todos desempleados, se infiltra en la lujosa vida de la adinerada familia Park.',
        imagen: 'https://images.unsplash.com/photo-1586951144438-26d4b072f44f?w=600&q=80'
      },
      {
        titulo: 'The Godfather',
        director: 'Francis Ford Coppola',
        genero: 'Crimen',
        anio: 1972,
        puntuacion: 9.2,
        sinopsis: 'El patriarca anciano de una dinastía criminal transfiere el control de su clandestino imperio a su reacio hijo.',
        imagen: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80'
      },
      {
        titulo: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        genero: 'Crimen',
        anio: 1994,
        puntuacion: 8.9,
        sinopsis: 'Las vidas de dos sicarios, un boxeador, un gángster y su esposa se entrelazan en cuatro historias de violencia y redención.',
        imagen: 'https://images.unsplash.com/photo-1497548419778-dc54e3dc2f75?w=600&q=80'
      },
      // ── Nuevas incorporaciones ──
      {
        titulo: 'The Matrix',
        director: 'Lana y Lilly Wachowski',
        genero: 'Ciencia Ficción',
        anio: 1999,
        puntuacion: 8.7,
        sinopsis: 'Un programador descubre que la realidad que conoce es una simulación creada por máquinas inteligentes y se une a la resistencia humana.',
        imagen: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80'
      },
      {
        titulo: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        genero: 'Drama',
        anio: 1994,
        puntuacion: 9.3,
        sinopsis: 'Un banquero inocente, condenado por el asesinato de su esposa, forja una amistad especial en la prisión de Shawshank mientras planea su escape.',
        imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
      },
      {
        titulo: 'Fight Club',
        director: 'David Fincher',
        genero: 'Drama',
        anio: 1999,
        puntuacion: 8.8,
        sinopsis: 'Un empleado de oficina insomne y un fabricante de jabón forman un club de lucha clandestino que evoluciona hacia algo mucho más peligroso.',
        imagen: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'
      },
      {
        titulo: 'Schindler\'s List',
        director: 'Steven Spielberg',
        genero: 'Historia',
        anio: 1993,
        puntuacion: 9.0,
        sinopsis: 'Durante el Holocausto, el empresario Oskar Schindler salva las vidas de más de mil judíos polacos al emplearlos en sus fábricas.',
        imagen: 'https://images.unsplash.com/photo-1580130544977-a0754f5a65e7?w=600&q=80'
      },
      {
        titulo: 'Forrest Gump',
        director: 'Robert Zemeckis',
        genero: 'Drama',
        anio: 1994,
        puntuacion: 8.8,
        sinopsis: 'La vida extraordinaria de Forrest Gump, un hombre de Alabama con bajo coeficiente intelectual que participa sin querer en los eventos más importantes del siglo XX.',
        imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80'
      },
      {
        titulo: 'Gladiator',
        director: 'Ridley Scott',
        genero: 'Acción',
        anio: 2000,
        puntuacion: 8.5,
        sinopsis: 'Un general romano traicionado es reducido a la esclavitud y se convierte en gladiador para vengarse del corrupto emperador que asesinó a su familia.',
        imagen: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80'
      },
      {
        titulo: 'Joker',
        director: 'Todd Phillips',
        genero: 'Drama',
        anio: 2019,
        puntuacion: 8.4,
        sinopsis: 'Arthur Fleck, un comediante fracasado, es rechazado por la sociedad y desciende a la locura convirtiéndose en el icónico villano del crimen Joker.',
        imagen: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80'
      },
      {
        titulo: 'Whiplash',
        director: 'Damien Chazelle',
        genero: 'Drama',
        anio: 2014,
        puntuacion: 8.5,
        sinopsis: 'Un joven baterista de jazz en un conservatorio de élite es sometido a la exigente y abusiva tutela de un instructor de renombre mundial.',
        imagen: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80'
      },
      {
        titulo: 'Dune',
        director: 'Denis Villeneuve',
        genero: 'Ciencia Ficción',
        anio: 2021,
        puntuacion: 8.0,
        sinopsis: 'Paul Atreides, un joven brillante y talentoso nacido con un gran destino, viaja al planeta más peligroso del universo para asegurar el futuro de su familia.',
        imagen: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80'
      },
      {
        titulo: 'No Country for Old Men',
        director: 'Joel y Ethan Coen',
        genero: 'Thriller',
        anio: 2007,
        puntuacion: 8.2,
        sinopsis: 'Un cazador de Texas se ve envuelto en una peligrosa huida tras encontrar dos millones de dólares junto a un cargamento de droga y cadáveres en el desierto.',
        imagen: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80'
      },
      {
        titulo: '1917',
        director: 'Sam Mendes',
        genero: 'Bélico',
        anio: 2019,
        puntuacion: 8.3,
        sinopsis: 'Dos soldados británicos reciben la misión casi imposible de cruzar territorio enemigo para entregar un mensaje que podría salvar la vida de 1600 hombres.',
        imagen: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=600&q=80'
      },
      {
        titulo: 'Spirited Away',
        director: 'Hayao Miyazaki',
        genero: 'Animación',
        anio: 2001,
        puntuacion: 9.3,
        sinopsis: 'Chihiro, una niña de 10 años, se adentra en un mundo de espíritus y debe trabajar en un baño mágico para rescatar a sus padres transformados en cerdos.',
        imagen: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80'
      },
      {
        titulo: 'The Silence of the Lambs',
        director: 'Jonathan Demme',
        genero: 'Thriller',
        anio: 1991,
        puntuacion: 8.6,
        sinopsis: 'Una joven agente del FBI debe recurrir a la ayuda del brillante y perturbado psiquiatra y caníbal Hannibal Lecter para atrapar a un asesino en serie.',
        imagen: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80'
      },
      {
        titulo: 'Titanic',
        director: 'James Cameron',
        genero: 'Romance',
        anio: 1997,
        puntuacion: 7.9,
        sinopsis: 'Jack y Rose, de clases sociales opuestas, se enamoran a bordo del transatlántico Titanic en su fatídico viaje inaugural hacia Nueva York.',
        imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'
      },
      {
        titulo: 'Avengers: Endgame',
        director: 'Anthony y Joe Russo',
        genero: 'Acción',
        anio: 2019,
        puntuacion: 8.4,
        sinopsis: 'Los Vengadores supervivientes buscan la manera de deshacer el daño causado por Thanos, quien con un chasquido eliminó la mitad de la vida en el universo.',
        imagen: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80'
      },
      {
        titulo: 'Kill Bill: Vol. 1',
        director: 'Quentin Tarantino',
        genero: 'Acción',
        anio: 2003,
        puntuacion: 8.2,
        sinopsis: 'Una asesina que fue traicionada y dejada por muerta el día de su boda despierta del coma y jura vengarse de su antiguo jefe y de todo su equipo.',
        imagen: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80'
      }
    ];

    // Si ya hay el número correcto de películas, no hacer nada
    if (snap.size >= datos.length) return;

    // Si hay películas pero faltan (versión antigua), borrar todo y re-insertar
    if (!snap.empty) {
      const batch = writeBatch(this.db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }

    // Insertar todas las películas del catálogo
    for (const p of datos) {
      await addDoc(collection(this.db, 'peliculas'), p);
    }
  }
}
