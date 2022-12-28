"use strict";
module.exports = (sequelize, DataTypes) => {
  const Matriculas = sequelize.define(
    "Matriculas",
    {
      status: DataTypes.STRING,
    },
    /* O "paranoid" serve para habilitar o soft delete. Para habilitarmos o soft delete, temos que criar a coluna "deletedAt". O Sequelize puxará como um registro ativo apenas os registros que não tiverem nenhum valor na coluna "deletedAt". */
    { paranoid: true }
  );
  Matriculas.associate = function (models) {
    Matriculas.belongsTo(models.Pessoas, {
      foreignKey: "estudante_id",
    });
    Matriculas.belongsTo(models.Turmas, {
      foreignKey: "turma_id",
    });
  };
  return Matriculas;
};
