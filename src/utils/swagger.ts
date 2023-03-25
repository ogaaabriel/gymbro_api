import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0",
    title: "GymBro API",
    description: "Sports social network API built with express and prisma",
  },
  host: process.env.HOST,
  basePath: "",
  schemes: [],
  consumes: [],
  produces: [],
  tags: [
    {
      name: "",
      description: "",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
    },
  },
  definitions: {
    userCredentials: {
      email: "user@example.com",
      password: "Pass1234",
    },
    userData: {
      email: "user@example.com",
      password: "Pass1234",
      firstName: "First name",
      lastName: "Last name",
    },
    refreshToken: {
      refreshToken: "token...",
    },
    revokeTokens: {
      userId: 1,
    },
  },
  components: {},
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
