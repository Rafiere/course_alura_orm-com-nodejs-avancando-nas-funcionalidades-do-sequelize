"use strict";
module.exports = (sequelize, DataTypes) => {
  const Pessoas = sequelize.define(
    "Pessoas",
    {
      /* Estamos criando uma função validadora customizada para o campo "nome". Essa validação será realizada no JavaScript. */
      nome: {
        type: DataTypes.STRING,
        validate: {
          funcaoValidadora: function (dado) {
            if (dado.length < 3) {
              throw new Error(
                'O campo "nome" deve ter mais do que três caracteres.'
              );
            }
          },
        },
      },
      ativo: DataTypes.BOOLEAN,
      email: {
        type: DataTypes.STRING,
        /* Estamos criando uma validação direto na tabela do banco de dados. Se o dado não bater com a validação, a inserção desse dado não será permitida. */
        validate: {
          isEmail: {
            args: true,
            msg: 'O dado do tipo "e-mail" está inválido.',
          },
        },
      },
      role: DataTypes.STRING,
    },
    /* O "defaultScope" fará apenas com que os elementos que possuem o atributo "ativo" igual a "true" sejam afetados pelas queries realizadas pelo modelo de "Pessoas". */
    {
      paranoid: true,
      defaultScope: {
        where: { ativo: true },
      },
      /* Como esse "where" está vazio, ao utilizarmos o escopo "todos", teremos todos os elementos do modelo "Pessoas", ou seja, ele não distinguirá por "ativo", como o escopo padrão faz. */
      scopes: {
        todos: { where: {} },
      },
    }
  );
  Pessoas.associate = function (models) {
    /* Estamos estabelecendo uma relação um para muitos. */
    Pessoas.hasMany(models.Turmas, {
      foreignKey: "docente_id",
    });
    Pessoas.hasMany(models.Matriculas, {
      foreignKey: "estudante_id",
      scope: { status: "confirmado" },
      as: "aulasMatriculadas",
    });
  };
  return Pessoas;
};
