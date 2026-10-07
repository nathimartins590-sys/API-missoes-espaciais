import express from "express";
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const missoes = [
    {
        id : 1,
        nome: "Apollo 11",
        ano: 1969,
        agencia: "NASA",
        status: "concluida"
    },
    {
         id : 2,
        nome: "Voyager 1",
        ano: 1977,
        agencia: "NASA",
        status: "em operação"
    }
]


/**
 * @openapi
 * /missoes:
 *   get:
 *     summary: Lista missoes
 *     description: Retorna a lista de missoes, com filtro opcional por nome
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra os missoes pelo nome
 *     responses:
 *       200:
 *         description: Lista de missoes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   ano:
 *                     type: integer
 *                   agencia:
 *                     type: string
 *                   status:
 *                     type: booclean
 */
app.get('/missoes', (req, res) =>{
    const nome = req.query?.nome || null
    let missoesFiltrados = null
    if(nome !== null){
      missoesFiltrados = missoes.filter(item => item.nome.toLowerCase()
                                                    .includes(nome.toLowerCase()));
    }

    missoesFiltrados = missoesFiltrados ?? livros;
    res.status(200).json(missoesFiltrados);
});

/**
 * @openapi
 * /missoes/{id}:
 *   get:
 *     summary: Busca uma missao pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: missao encontrada
 *       404:
 *         description: missao não encontrada
 */
app.get('/missoes/:id', (req, res) =>{
    const id = Number(req.params?.id);

    const missao = missoes.find(item => item.id === id);

    if(!missao){
        return res.status(404).json({error: "missão não encontrada"})
    }

    res.status(200).json(missao);

});


/**
 * @openapi
 * /missoes:
 *   post:
 *     summary: Cria uma nova missao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - ano
 *             properties:
 *               nome:
 *                 type: string
 *               ano:
 *                 type: integer
 *               agencia:
 *                 type: string
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: missao criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
app.post('/missoes', (req, res)=>{

    const nome = req.body?.nome || null;
    const ano = req.body?.ano || null;

      if(!nome){
        return res.status(400).json({error: "Nome da missão é obrigatório"})
      }

      if(!ano){
        return res.status(400).json({error: "O ano da missão é obrigatório"})
      }

        const novaMissao = {
            id: missoes.length + 1,
            nome : nome,
            ano : ano,
            agencia: agencia,
            disponviel: req.body?.disponivel || false
        }

        missoes.push(novaMissao);

        res.status(201).json(novaMissao);

});

/**
 * @openapi
 * /missoes/{id}:
 *   put:
 *     summary: Atualiza uma missao pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Apolo 11
 *               ano:
 *                 type: integer
 *                 example: 1969
 *               agencia:
 *                 type: string
 *               status:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Missao atualizada com sucesso
 *       404:
 *         description: Missao não encontrada
 */
app.put('/missoes/:id', (req, res) => {
    const id = Number(req.params.id);
    const missao = missoes.find(item => item.id === id);
    if(!missao){
        return res.status(404).json({error: "Missão não encontrado"})
    }

    if(req?.body?.nome && req.body.nome !== ""){
        missao.nome = req.body.nome;
    }

    if(req?.body?.ano && req.body.ano !== ""){
        missao.ano = req.body.ano;
    }

    if(req?.body?.agencia && req.body.agencia !== ""){
        missao.agencia = req.body.agencia;
    }

    if(req?.body?.status && req.body.status !== ""){
        missao.disponivel = req.body.disponivel;
    }

    res.status(200).json(missao)
});

/**
 * @openapi
 * /missoes/{id}:
 *   delete:
 *     summary: Exclui uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Missao excluida com sucesso
 *       404:
 *         description: Missao não encontrada
 */
app.delete('/missoes/:id', (req, res) =>{
    const id = Number(req.params.id);
    const missao = missoes.findIndex(item => item.id === id)

    if(missao === -1){
        return res.status(404).json({ error: "Missão não encontrada" })
    }

    missoes.splice(missao, 1);

    res.status(204).send('')

});

app.get('/missao', async (_, res) => {
  const url = `https://api.nasa.gov/`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    res.status(200).json(dados);
  } catch (erro) {
    res.status(502).json({ erro: 'Falha ao consultar serviço de missão' });
  }
});

export default app;