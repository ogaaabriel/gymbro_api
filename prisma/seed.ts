import bcrypt from "bcrypt";

import db from "../src/utils/db";

const main = async () => {
  await db.user.create({
    data: {
      email: "admin001@example.com",
      password: await bcrypt.hash("Gymbro123", 10),
      firstName: "Admin",
      lastName: "00001",
      isAdmin: true,
    },
  });
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch((error) => console.log(error));
