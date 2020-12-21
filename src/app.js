const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
	const { id } = request.params;

  if(!isUuid(id)){
		return response.status(400).json({ error: 'Invalid repository ID.' });
	}

	return next();
}

app.use('/projects/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
	const { url, title, techs } = request.body;

	const repository = { id: uuid(), url, title, techs, likes: 0 };

	repositories.push(repository);

	return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
	const { url, title, techs } = request.body;

	const repositoryIndex = repositories.findIndex(repository => repository.id == id);

	if (repositoryIndex < 0) {
		return response.status(400).json({ error: 'Repository not found' });
	}

	const oldRepository = repositories[repositoryIndex];

	const repository = { id: id, url: url, title: title, techs: techs, likes: oldRepository.likes };

	repositories[repositoryIndex] = repository;

	return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

	const repositoryIndex = repositories.findIndex(repository => repository.id == id);

	if (repositoryIndex < 0) {
		return response.status(400).json({ error: 'Repository not found' });
	}

	repositories.splice(repositoryIndex, 1);

	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;

	const repositoryIndex = repositories.findIndex(repository => repository.id == id);

	if (repositoryIndex < 0) {
		return response.status(400).json({ error: 'Repository not found' });
	}

	const oldRepository = repositories[repositoryIndex];

	const repository = { 
		id: id,
		url: oldRepository.url,
		title: oldRepository.title,
		techs: oldRepository.techs,
		likes: (oldRepository.likes + 1)
	};

	repositories[repositoryIndex] = repository;

	return response.json(repository);
});

module.exports = app;
