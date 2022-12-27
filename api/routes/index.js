/* Esse arquivo será o ponto de entrada de todas as rotas da aplicação. */

const bodyParser = require("body-parser");

const pessoas = require("./pessoasRoute.js");
const niveis = require("./niveisRoute.js");
const turmas = require("./turmasRoute.js");

module.exports = (app) => {
  /* Estamos avisando para o Express que a biblioteca "Body Parser" fará o meio de campo entre as requisições e a aplicação, convertendo o corpo das requisições para o formato JSON. */
  app.use(bodyParser.json());
  app.use(pessoas);
  app.use(niveis);
  app.use(turmas);
};
