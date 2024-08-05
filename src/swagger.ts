import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Microsoft Lists Clone",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
      {
        url: "https://microsoft-lists-clone.onrender.com",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
