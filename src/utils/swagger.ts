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
      email: "user1@email.com",
      password: "Gymbro123",
    },
    userData: {
      email: "user100@email.com",
      password: "Gymbro123",
      firstName: "First name",
      lastName: "Last name",
    },
    forgotPassword: {
      email: "user@example.com",
    },
    resetPassword: {
      newPassword: "pass1234",
    },
    refreshToken: {
      refreshToken: "token...",
    },
    revokeTokens: {
      userId: 1,
    },
    eventData: {
      title: "Some title",
      description: "Some description",
      eventDate: "2023-04-10T15:43:40.783Z",
      isPublic: true,
      hasLimit: true,
      limitCount: 10,
      geocode: [-22.8057839, -45.1908926],
    },
    updateEventInfo: {
      title: "Some title",
      description: "Some description",
      isPublic: true,
      hasLimit: true,
      limitCount: 10,
      geocode: [-22.8057839, -45.1908926],
    },
    updateEventDate: {
      eventDate: "2023-04-10T15:43:40.783Z",
    },
    pagination: {
      page: 1,
      numItems: 10,
    },
  },
  components: {},
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
