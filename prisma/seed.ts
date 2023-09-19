import bcrypt from "bcrypt";

import db from "../src/utils/db";

// Corrida, Artes-Marciais, Futebol, Futsal, Basquete, Vôlei, Ciclismo, Musculação, Ciclismo, Esportes Radicais, Outros
const eventTypeList = [
  { title: "Corrida", eventTypeIconUrl: "#" },
  { title: "Artes-Marciais", eventTypeIconUrl: "#" },
  { title: "Futebol", eventTypeIconUrl: "#" },
  { title: "Futsal", eventTypeIconUrl: "#" },
  { title: "Basquete", eventTypeIconUrl: "#" },
  { title: "Vôlei", eventTypeIconUrl: "#" },
  { title: "Ciclismo", eventTypeIconUrl: "#" },
  { title: "Musculação", eventTypeIconUrl: "#" },
  { title: "Esportes Radicais", eventTypeIconUrl: "#" },
  { title: "Outro", eventTypeIconUrl: "#" },
]

const eventsList = [
  {
    title: "Jogo de futebol",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis massa lacinia, tempor nulla in, auctor est. Praesent nunc nunc, ultrices ac tempor eu, rutrum vitae magna. Maecenas varius nisi quam, vel facilisis nisi ornare sit amet. Aliquam mi neque, efficitur sed sem eget, tristique malesuada erat.",
    eventTypeId: 3,
    geocode: [-22.793602912218237, -45.18656121451332],
    address: "Rua São Paulo, 221",
  },
  {
    title: "Treino Naja",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis massa lacinia, tempor nulla in, auctor est. Praesent nunc nunc, ultrices ac tempor eu, rutrum vitae magna. Maecenas varius nisi quam, vel facilisis nisi ornare sit amet. Aliquam mi neque, efficitur sed sem eget, tristique malesuada erat.",
    eventTypeId: 2,
    geocode: [-22.790396420583914, -45.18435793749387],
    address: "Rua São Paulo, 221",
  },
  {
    title: "Jogo de futebol",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis massa lacinia, tempor nulla in, auctor est. Praesent nunc nunc, ultrices ac tempor eu, rutrum vitae magna. Maecenas varius nisi quam, vel facilisis nisi ornare sit amet. Aliquam mi neque, efficitur sed sem eget, tristique malesuada erat.",
    eventTypeId: 1,
    geocode: [-22.786660267840674, -45.18468778481507],
    address: "Rua São Paulo, 221",
  },
  {
    title: "Treino de musculação",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis massa lacinia, tempor nulla in, auctor est. Praesent nunc nunc, ultrices ac tempor eu, rutrum vitae magna. Maecenas varius nisi quam, vel facilisis nisi ornare sit amet. Aliquam mi neque, efficitur sed sem eget, tristique malesuada erat.",
    eventTypeId: 8,
    geocode: [-22.799385160009166, -45.184126539229084],
    address: "Rua São Paulo, 221",
  },
  {
    title: "Caminhada",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis massa lacinia, tempor nulla in, auctor est. Praesent nunc nunc, ultrices ac tempor eu, rutrum vitae magna. Maecenas varius nisi quam, vel facilisis nisi ornare sit amet. Aliquam mi neque, efficitur sed sem eget, tristique malesuada erat.",
    eventTypeId: 10,
    geocode: [-22.78356276588366, -45.186044128313526],
    address: "Rua São Paulo, 221",
  },
];

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

  for (let i = 1; i < 5; i++) {
    await db.user.create({
      data: {
        email: `user${i}@email.com`,
        password: await bcrypt.hash("Gymbro123", 10),
        firstName: "User",
        lastName: `0000${i}`,
        isEmailConfirmed: true,
      },
    });
  }

  for (let i = 0; i < eventTypeList.length; i++) {
    await db.eventType.create({
      data: {
        ...eventTypeList[i],
      },
    });
  }

  for (let i = 0; i < eventsList.length; i++) {
    await db.event.create({
      data: {
        eventDate: new Date("2023-12-30T15:34:05.852Z"),
        adminId: 2,
        ...eventsList[i],
      },
    });
  }

  for (let i = 1; i < eventsList.length + 1; i++) {
    for (let j = 3; j < 6; j++) {
      await db.usersOnEvents.create({
        data: {
          eventId: i,
          userId: j,
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
