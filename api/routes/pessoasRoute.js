const { Router } = require("express");

const PessoaController = require("../controllers/PessoaController.js");

const router = Router();

/* Quando essa rota for chamada, o método "obterTodasAsPessoas()" será executado. */
router.get("/pessoas", PessoaController.obterTodasAsPessoasAtivas);
router.get("/pessoas/todos", PessoaController.obterTodasAsPessoas);
router.get("/pessoa/:id", PessoaController.obterPessoaPorId);
router.get("/pessoas/:estudanteId/matricula", PessoaController.pegaMatriulas);
router.get(
  "/pessoas/matricula/:turmaId/confirmadas",
  PessoaController.pegaMatriculasPorTurma
);

router.get("/pessoas/matricula/lotada", PessoaController.pegaTurmasLotadas);

router.post("/pessoa", PessoaController.criarPessoa);
router.post("/pessoas/:id/restaura", PessoaController.restauraPessoa);
router.post("/pessoas/:estudanteId/cancela", PessoaController.cancelaPessoa);

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
