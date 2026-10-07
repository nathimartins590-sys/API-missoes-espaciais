import swaggerJSdoc from "swagger-jsdoc";

const opcoes = {
    defenition: {
        openapi: "3.0.0",
         info: { title: "API da Nasa", version: "1.0.0" },
  },
  apis: ["./app.js"],
};

export default swaggerJSdoc(opcoes);