import bcrypt from "bcrypt";

import db from "../src/utils/db";
import { getAddress } from "../src/utils/helpers";

// Corrida, Artes-Marciais, Futebol, Futsal, Basquete, Vôlei, Ciclismo, Musculação, Ciclismo, Esportes Radicais, Outros
const eventTypesList = [
  { title: "Corrida", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/running.png" },
  { title: "Artes-Marciais", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/martial-arts.png" },
  { title: "Futebol", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/soccer.png" },
  { title: "Futsal", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/soccer.png" },
  { title: "Basquete", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/basketball.png" },
  { title: "Vôlei", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/volleyball.png" },
  { title: "Ciclismo", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/cycling.png" },
  { title: "Musculação", eventTypeIconUrl: "http://gymbro-apy.onrender.com/icons/weight-lifting.png" },
  { title: "Esportes Radicais", eventTypeIconUrl: "#" },
  { title: "Outro", eventTypeIconUrl: "#" },
]

const usersList = [
  { email: 'adrian@email.com', firstName: 'Adrian', lastName: 'Ferraz' },
  { email: 'gabriel@email.com', firstName: 'Gabriel', lastName: 'Rodrigues' },
  { email: 'joao@email.com', firstName: 'João', lastName: 'Paulo' },
  { email: 'marco@email.com', firstName: 'Marco', lastName: 'Vinicius' },
  { email: 'allbert@email.com', firstName: 'Allbert', lastName: 'Velleniche' },
  { email: 'bruno@email.com', firstName: 'Bruno', lastName: 'Donizeti' },
  { email: 'cristovao@email.com', firstName: 'Cristóvão', lastName: 'Cunha' },
  { email: 'claudemir@email.com', firstName: 'Claudemir', lastName: 'Pinto' },
  { email: 'jose@email.com', firstName: 'José', lastName: 'Geraldo' },
]

const eventsList = (async () => {
  return [
    {
      title: "Jogo de futebol",
      description:
        "Junte-se a nós para uma tarde de futebol emocionante! Venha vibrar com jogadas incríveis e gols espetaculares.",
      eventTypeId: 3,
      geocode: [-22.793602912218237, -45.18656121451332],
      address: await getAddress(-22.793602912218237, -45.18656121451332),
    },
    {
      title: "Treino Naja",
      description:
        "Desperte a sua força interior! Convidamos você para um treino intenso de Naja. Supere desafios, desenvolva agilidade e alcance novos patamares. Venha elevar o seu treino! 🐍💪 #TreinoNaja #ForcaInterior",
      eventTypeId: 2,
      geocode: [-22.790396420583914, -45.18435793749387],
      address: await getAddress(-22.790396420583914, -45.18435793749387),
    },
    {
      title: "Jogo de futebol",
      description:
        "Junte-se a nós para uma tarde de futebol emocionante! Venha vibrar com jogadas incríveis e gols espetaculares.",
      eventTypeId: 3,
      geocode: [-22.786660267840674, -45.18468778481507],
      address: await getAddress(-22.786660267840674, -45.18468778481507),
    },
    {
      title: "Treino de musculação",
      description:
        "Transforme seu corpo, supere seus limites! Junte-se a nós para um treino de musculação intenso e motivador. Desenvolva força, defina seus músculos e alcance seus objetivos fitness. Venha moldar o seu melhor eu! 💪✨ #TreinoMusculacao #ForcaETransformacao",
      eventTypeId: 8,
      geocode: [-22.799385160009166, -45.184126539229084],
      address: await getAddress(-22.799385160009166, -45.184126539229084),
    },
    {
      title: "Corrida",
      description:
        "Convidamos você para um treino de corrida revigorante. Desperte a energia, supere seus próprios recordes e sinta a liberdade dos seus passos. Vamos correr juntos em busca da superação! 🏃‍♂️🌟 #TreinoDeCorrida #SupereSeusLimites",
      eventTypeId: 1,
      geocode: [-22.78356276588366, -45.186044128313526],
      address: await getAddress(-22.78356276588366, -45.186044128313526),
    },
    {
      title: "Corrida",
      description:
        "Convidamos você para um treino de corrida revigorante. Desperte a energia, supere seus próprios recordes e sinta a liberdade dos seus passos. Vamos correr juntos em busca da superação! 🏃‍♂️🌟 #TreinoDeCorrida #SupereSeusLimites",
      eventTypeId: 1,
      geocode: [-22.7799486, -45.1941045],
      address: await getAddress(-22.7799486, -45.1941045),
    },
    {
      title: "Corrida",
      description:
        "Convidamos você para um treino de corrida revigorante. Desperte a energia, supere seus próprios recordes e sinta a liberdade dos seus passos. Vamos correr juntos em busca da superação! 🏃‍♂️🌟 #TreinoDeCorrida #SupereSeusLimites",
      eventTypeId: 1,
      geocode: [-22.7890081, -45.1951488],
      address: await getAddress(-22.7890081, -45.1951488),
    },
    {
      title: "Treino de musculação",
      description:
        "Transforme seu corpo, supere seus limites! Junte-se a nós para um treino de musculação intenso e motivador. Desenvolva força, defina seus músculos e alcance seus objetivos fitness. Venha moldar o seu melhor eu! 💪✨ #TreinoMusculacao #ForcaETransformacao",
      eventTypeId: 8,
      geocode: [-22.8068057, -45.1809424],
      address: await getAddress(-22.8068057, -45.1809424),
    },
    {
      title: "Treino de musculação",
      description:
        "Transforme seu corpo, supere seus limites! Junte-se a nós para um treino de musculação intenso e motivador. Desenvolva força, defina seus músculos e alcance seus objetivos fitness. Venha moldar o seu melhor eu! 💪✨ #TreinoMusculacao #ForcaETransformacao",
      eventTypeId: 8,
      geocode: [-22.793603, -45.1822602],
      address: await getAddress(-22.793603, -45.1822602),
    },
    {
      title: "Treino de musculação",
      description:
        "Transforme seu corpo, supere seus limites! Junte-se a nós para um treino de musculação intenso e motivador. Desenvolva força, defina seus músculos e alcance seus objetivos fitness. Venha moldar o seu melhor eu! 💪✨ #TreinoMusculacao #ForcaETransformacao",
      eventTypeId: 8,
      geocode: [-22.7993973, -45.2081666],
      address: await getAddress(-22.7993973, -45.2081666),
    },
  ]
})();

const main = async () => {
  await db.user.create({
    data: {
      email: "admin@email.com",
      password: await bcrypt.hash("Gymbro123", 10),
      firstName: "Admin",
      lastName: "00001",
      isAdmin: true,
      isEmailConfirmed: true,
    },
  });

  for (let i = 0; i < usersList.length; i++) {
    await db.user.create({
      data: {
        email: usersList[i].email,
        password: await bcrypt.hash("Gymbro123", 10),
        firstName: usersList[i].firstName,
        lastName: usersList[i].lastName,
        isEmailConfirmed: true,
        profilePicturePath: 'uploads/profile_pictures/default.jpg',
        profilePictureUrl: 'http://gymbro-apy.onrender.com/profile_pictures/default.jpg'
      },
    });
  }

  for (let i = 0; i < eventTypesList.length; i++) {
    await db.eventType.create({
      data: {
        ...eventTypesList[i],
      },
    });
  }

  for (let i = 0; i < (await eventsList).length; i++) {
    const newEvent = await db.event.create({
      data: {
        eventDate: new Date("2023-12-30T15:34:05.852Z"),
        adminId: Math.floor(Math.random() * (usersList.length - 2 + 1)) + 2,
        ...(await eventsList)[i],
      },
    });

    for (let j = 0; j < usersList.length; j++) {
      if (newEvent.adminId == j + 2) continue;
      await db.usersOnEvents.create({
        data: {
          eventId: i + 1,
          userId: j + 2,
        },
      });
    }
  }
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch((error) => console.log(error));
