const { render } = require("../index.js");
const database = require("../models/index.js");
const Sequelize = require("sequelize");

class PessoaController {
  static async obterTodasAsPessoas(req, res) {
    /* O método "findAll()" do Sequelize buscará todas as pessoas que estão na tabela "Pessoas", que é o arquivo retornado pelo model "pessoas.js". Ele utilizará o escopo "todos", e não o escopo padrão, assim, ele buscará todas as pessoas, mesmo as que não estão ativas. */

    try {
      const todasAsPessoas = await database.Pessoas.scope("todos").findAll();
      return res.status(200).json(todasAsPessoas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async obterTodasAsPessoasAtivas(req, res) {
    try {
      const todasAsPessoasAtivas = await database.Pessoas.findAll();
      return res.status(200).json(todasAsPessoasAtivas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async obterPessoaPorId(req, res) {
    try {
      const { id } = req.params;

      const pessoaBuscada = await database.Pessoas.findOne({
        where: { id: Number(id) },
      });

      return res.status(200).json(pessoaBuscada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criarPessoa(req, res) {
    try {
      const novaPessoaBody = req.body;

      const novaPessoaCriada = await database.Pessoas.create(novaPessoaBody);

      return res.status(201).json(novaPessoaCriada);
    } catch (err) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizarPessoa(req, res) {
    const novasInformacoes = req.body;
    const { id } = req.params;

    try {
      await database.Pessoas.update(novasInformacoes, {
        where: {
          id: Number(id),
        },
      });
      return res
        .status(201)
        .json({ message: "Registro atualizado com sucesso!" });
    } catch (err) {
      return res.status(500).json(error.message);
    }
  }

  static async deletarPessoa(req, res) {
    try {
      const { id } = req.params;
      await database.Pessoas.destroy({
        where: {
          id: Number(id),
        },
      });

      return res
        .status(204)
        .json({ message: "O registro foi deletado com sucesso!" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params;

    /* Estamos atribuindo o "deletedAt" como "null". */
    try {
      await database.Pessoas.restore({ where: { id: Number(id) } });

      return res.status(200).json({ message: `ID ${id} foi restaurado.` });
    } catch (err) {
      return res.status(500).json(error.message);
    }
  }

  /* Os métodos de "matricula" ficarão dentro do controlador de pessoa. */

  static async obterMatriculaPorId(req, res) {
    try {
      const { estudanteId, matriculaId } = req.params;

      const umaMatricula = await database.Matriculas.findOne({
        where: { id: Number(matriculaId), estudante_id: Number(estudanteId) },
      });

      return res.status(200).json(umaMatricula);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criarMatricula(req, res) {
    try {
      const { estudanteId } = req.params;
      const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) };

      const novaMatriculaCriada = await database.Matriculas.create(
        novaMatricula
      );

      return res.status(201).json(novaMatriculaCriada);
    } catch (err) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizarMatricula(req, res) {
    const novasInformacoes = req.body;

    const { estudanteId, matriculaId } = req.params;

    try {
      await database.Matriculas.update(novasInformacoes, {
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        },
      });
      return res
        .status(201)
        .json({ message: "Registro atualizado com sucesso!" });
    } catch (err) {
      return res.status(500).json(error.message);
    }
  }

  static async deletarMatricula(req, res) {
    try {
      const { matriculaId } = req.params;
      await database.Matriculas.destroy({
        where: {
          id: Number(matriculaId),
        },
      });

      return res
        .status(204)
        .json({ message: "O registro foi deletado com sucesso!" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async pegaMatriculas(req, res) {
    try {
      const { estudanteId } = req.params;
      const pessoa = await database.Pessoas.findOne({
        where: { id: Number(estudanteId) },
      });

      const matriculas = await pessoa.getAulasMatriculadas();

      return res.status(200).json(matriculas);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async pegaMatriculasPorTurma(req, res) {
    const { turmaId } = req.params;

    try {
      const todasAsMatriculas = await database.Matriculas.findAndCountAll({
        where: {
          turma_id: Number(turmaId),
          status: "confirmado",
        },
      });

      return res.status(200).json(todasAsMatriculas);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async pegaTurmasLotadas(req, res) {
    const lotacaoTurma = 2;
    const { turmaId } = req.params;

    try {
      const turmasLotadas = await database.Matriculas.findAndCountAll({
        where: {
          status: "confirmado",
        },
        /* Queremos trabalhar com o modelo "turma_id" e juntaremos os resultados de acordo com o valor da coluna "turma_id". */
        attributes: ["turma_id"],
        group: ["turma_id"],
        having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`),
      });

      return res.status(200).json(turmasLotadas.count);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async cancelaPessoa(req, res) {
    const { estudanteId } = req.params;

    /* Estamos inserindo todas essas operações de banco de dados em uma transação. */
    try {
      database.sequelize.transaction(async (transacao) => {
        await database.Pessoas.update(
          { ativo: false },
          { where: { id: Number(estudanteId) } },
          { transaction: transacao }
        );

        await database.Matriculas.update(
          { status: "cancelado" },
          { where: { estudante_id: Number(estudanteId) } },
          { transaction: transacao }
        );

        return res.status(200).json({
          message: `Matrículas referentes ao estudante ${estudanteId} canceladas!`,
        });
      });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

module.exports = PessoaController;
