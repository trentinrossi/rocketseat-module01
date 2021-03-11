const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

/**
 * Chamado de Middleware geral, onde todas as requisições que entrarem no NODE, passarão por aqui
 * para depois seguir para outros middlewares através do next();
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function logInterceptor(req, res, next) {
  const { method, path } = req;

  console.log(`Método: ${method}`);
  console.log(`Path..: ${path}`);
  console.count(`Quantidade: `);

  return next();
}

server.use(logInterceptor);

/**
 * Crie um middleware que será utilizado em todas rotas que recebem o ID
 * do projeto nos parâmetros da URL que verifica se o projeto com aquele ID
 * existe. Se não existir retorne um erro, caso contrário permita a requisição
 * continuar normalmente;
 */
function projectValidator(req, res, next) {
  const { id } = req.params;
  const project = projects.find((p) => p.id == id);

  if (!project) {
    return res.status(400).json({ error: `Project not found with id: ${id}` });
  }

  return next();
}

/**
 * POST /projects: A rota deve receber id e title dentro corpo de cadastrar
    um novo projeto dentro de um array no seguinte formato: { id: "1",
    title: ’Novo projeto’, tasks: [] }; Certifique-se de enviar tanto
    o ID quanto o título do projeto no formato string com àspas duplas
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id,
    title,
    tasks: [],
  };

  projects.push(newProject);
  return res.json(projects);
});

/**
 * GET /projects: Rota que lista todos projetos e suas tarefas;
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * PUT /projects/:id: A rota deve alterar apenas o título do projeto com
    o id presente nos parâmetros da rota;
 */
server.put("/projects/:id", projectValidator, (req, res) => {
  const { title } = req.body;
  const id = req.params.id;

  const project = projects.find((p) => p.id == id);
  project.title = title;
  return res.json(project);
});

/**
 * DELETE /projects/:id: A rota deve deletar o projeto com o id presente
    nos parâmetros da rota;
 */
server.delete("/projects/:id", projectValidator, (req, res) => {
  const { id } = req.params;
  projects.splice(id, 1);
  return res.send();
});

/**
 * POST /projects/:id/tasks: A rota deve receber um campo title e
    armazenar uma nova tarefa no array de tarefas de um projeto específico
    escolhido através do id presente nos parâmetros da rota;
 */
server.post("/projects/:id/tasks", projectValidator, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find((p) => p.id == id);
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);
