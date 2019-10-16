const express = require('express');

const server = express();

server.use(express.json());

server.listen(3000);

const projects = [];

let counter = 0;

// Middleware global que conta quantas requisições foram feitas

server.use((req, res, next) => {
  counter ++;

  console.log(`Número de requisições: ${counter}`);
  
  next();
}) 

// Middleware que verifica se o projeto com o passado ID existe

function verifyProjectId(req, res, next){
  const { id } = req.params;

  const project = projects.find( project => project.id === id );

  if(!project) {
    return res.status(400).json({ error: "This project does not exist. Verify project id."});
  }

  return next();
}


// Rota que cadastra um novo projeto

server.post('/projects', (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  projects.push({ 
    id: id, 
    title: title, 
    tasks: []
  });

  return res.json(projects);
})

// Rota que lista todos os projetos e suas tarefas

server.get('/projects', (req, res) => {
  return res.json(projects);
})

// Rota que altera apenas o título do projeto com o id presente nos parâmetros da rota

server.put('/projects/:id', verifyProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find( project => project.id === id )

  project.title = title;

  return  res.json(projects);
})

// Rota que deleta o projeto com o id presente nos parâmetros da rota

server.delete('/projects/:id', verifyProjectId, (req, res) => {  
  const { id } = req.params;

  const project = projects.find( project => project.id === id );

  projects.splice(projects.indexOf(project), 1);

  return res.json(projects);
})

// Rota que armazena uma nova tarefa no array de tarefas de um projeto específico

server.post('/projects/:id/tasks', verifyProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find( project => project.id === id );

  project.tasks.push(title);

  return res.json(projects);
})  