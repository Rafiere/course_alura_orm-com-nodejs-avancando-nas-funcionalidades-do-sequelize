const { Router } = require("express");

const PessoaController = require("../controllers/PessoaController.js");

const router = Router();

/* Quando essa rota for chamada, o método "obterTodasAsPessoas()" será executado. */
router.get("/pessoas", PessoaController.obterTodasAsPessoas);
router.get("/pessoa/:id", PessoaController.obterPessoaPorId);
router.post("/pessoa", PessoaController.criarPessoa);
router.put("/pessoa/:id", PessoaController.atualizarPessoa);
router.delete("/pessoa/:id", PessoaController.deletarPessoa);

/* Rotas de Matrícula */
router.get(
  "/pessoa/:estudanteId/matricula/:matriculaId",
  PessoaController.obterMatriculaPorId
);

router.post("/pessoa/:estudanteId/matricula", PessoaController.criarMatricula);

router.put(
  "/pessoa/:estudanteId/matricula/:matriculaId",
  PessoaController.atualizarMatricula
);

router.delete(
  "/pessoa/matricula/:matriculaId",
  PessoaController.deletarMatricula
);

module.exports = router;
