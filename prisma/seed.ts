import bcrypt from "bcrypt";

import db from "../src/utils/db";

const main = async () => {
  await db.user.create({
    data: {
      email: "admin@email.com",
      password: await bcrypt.hash("Gymbro123", 10),
      firstName: "Admin",
      lastName: "00001",
      isAdmin: true,
    },
  });

  for (let i = 1; i < 5; i++) {
    await db.user.create({
      data: {
        email: `user${i}@email.com`,
        password: await bcrypt.hash("Gymbro123", 10),
        firstName: "User",
        lastName: `0000${i}`,
      },
    });
  }

  for (let i = 1; i < 6; i++) {
    await db.event.create({
      data: {
        title: `Event ${i}`,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit odio dolor, vel luctus velit tincidunt quis. Duis condimentum justo elementum, sagittis erat vitae, tincidunt lorem.",
        eventDate: new Date("2023-05-30T15:34:05.852Z"),
        geocode: [-22.8057839, -45.1908926],
        adminId: 2,
      },
    });
  }

  for (let i = 1; i < 6; i++) {
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
