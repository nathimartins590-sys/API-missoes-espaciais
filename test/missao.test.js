import request from "supertest";
import app from "../app.js";

test("POST /missoes cria uma nova missão", async () => {
  const resposta = await request(app).post("/livros")
    .send({ nome: "Apolo 11", autor: 1969 });

  expect(resposta.status).toBe(201);
  expect(resposta.body.titulo).toBe("Apolo 11");
});

test("POST /missoes retorna erro ao não informar o nome", async () => {
  const resposta = await request(app).post("/missoes")
    .send({ titulo: "Apolo 11" });

  expect(resposta.status).toBe(400);
  expect(resposta.body.error).toBe("Nome da missão é obrigatório");
});


test("GET /missoes filtra missão pelo nome", async () => {
  const resposta = await request(app).get("/missoes")
    .send("nome=voyager");

  expect(resposta.status).toBe(200);
  expect(resposta.body[0].nome).toBe("Voyager 1");
});

test("GET /missoes duas missões já cadastradas", async () => {
  const resposta = await request(app).get("/missoes")
    .send();

  expect(resposta.status).toBe(200);
  expect(resposta.body.length).toBe(3);
});

test("GET /missoes filtra por nome sem diferenciar maiúsculas", async () => {
  const resposta = await request(app).get("/missoes")
    .query({ titulo: "APOLO 11" });

  expect(resposta.status).toBe(200);
  expect(resposta.body).toHaveLength(1);
  expect(resposta.body[0].nome).toBe("Apolo 11");
});

test("GET /missoes retorna lista vazia quando não encontra o nome", async () => {
  const resposta = await request(app).get("/missoes")
    .query({ nome: "missão inexistente" });

  expect(resposta.status).toBe(200);
  expect(resposta.body).toEqual([]);
});

test("GET /missoes/:id retorna a missão encontrada", async () => {
  const resposta = await request(app).get("/missoes/1");

  expect(resposta.status).toBe(200);
  expect(resposta.body.id).toBe(1);
});

test("GET /missoes/:id retorna erro quando a missão não existe", async () => {
  const resposta = await request(app).get("/missoes/999");

  expect(resposta.status).toBe(404);
  expect(resposta.body).toEqual({ error: "missão não encontrada" });
});

test("POST /missoes retorna erro quando o nome não é informado", async () => {
  const resposta = await request(app).post("/missoes")
    .send({ ano: "A sem nome" });

  expect(resposta.status).toBe(400);
  expect(resposta.body.error).toBe("Nome é obrigatório");
});

test("PUT /missoes/:id atualiza os campos informados", async () => {
  const resposta = await request(app).put("/missoes/1")
    .send({ nome: "Nome atualizado", ano: "ano da missão", agencia: "nome da agencia", status: "status da missão" });

  expect(resposta.status).toBe(200);
  expect(resposta.body).toMatchObject({
    id: 1,
    nome: "Nome atualizado",
    ano: "Ano da missão",
    agencia: "nome da agencia",
    status: "status da missão"
  });
});

test("PUT /missoes/:id preserva os campos quando recebem valores vazios ou falsos", async () => {
  const resposta = await request(app).put("/missoes/1")
    .send({ titulo: "", autor: "", agencia: "", status: "" });

  expect(resposta.status).toBe(200);
  expect(resposta.body).toMatchObject({
    nome: "Nome atualizado",
    ano: "Ano da missão",
    agencia: "nome da agencia",
    status: "status da missão"
  });
});

test("PUT /missoes/:id retorna erro quando a missao não existe", async () => {
  const resposta = await request(app).put("/missoes/999")
    .send({ nome: "Nome" });

  expect(resposta.status).toBe(404);
  expect(resposta.body).toEqual({ error: "Missão não encontrado" });
});

test("DELETE /missoes/:id remove a missao encontrado", async () => {
  const resposta = await request(app).delete("/missoes/4");

  expect(resposta.status).toBe(204);
  expect(resposta.body).toEqual({});
});

test("DELETE /missoes/:id retorna erro quando a missao não existe", async () => {
  const resposta = await request(app).delete("/missoes/999");

  expect(resposta.status).toBe(404);
  expect(resposta.body).toEqual({ error: "Missão não encontrado" });
});