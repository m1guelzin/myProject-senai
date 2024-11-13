const connect = require("../db/connect");

module.exports = class salasController {
  
  // Criar uma nova sala
  static async createSala(req, res) {
    const { nome_da_sala, capacidade, localizacao, disponibilidade, equipamentos } = req.body;

    if (!nome_da_sala || !capacidade || !localizacao || disponibilidade === undefined || !equipamentos) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const queryInsert = `INSERT INTO salas (nome_da_sala, capacidade, localizacao, disponibilidade, equipamentos) VALUES (?, ?, ?, ?, ?)`;
    const values = [nome_da_sala, capacidade, localizacao, disponibilidade, equipamentos];

    try {
      connect.query(queryInsert, values, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao cadastrar a sala" });
        }
        return res.status(201).json({ message: "Sala cadastrada com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar todas as salas
  static async getAllSalas(req, res) {
    const query = `SELECT * FROM salas`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao listar as salas" });
        }
        return res.status(200).json({ message: "Lista de Salas", salas: results });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Atualizar uma sala
  static async updateSala(req, res) {
    const { id_salas, nome_da_sala, capacidade, localizacao, disponibilidade, equipamentos } = req.body;

    if (!id_salas || !nome_da_sala || !capacidade || !localizacao || disponibilidade === undefined) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const queryUpdate = `UPDATE salas SET nome_da_sala=?, capacidade=?, localizacao=?, disponibilidade=?, equipamentos=? WHERE id_salas = ?`;
    const values = [nome_da_sala, capacidade, localizacao, disponibilidade, equipamentos, id_salas];

    try {
      connect.query(queryUpdate, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao atualizar a sala" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Sala não encontrada" });
        }
        return res.status(200).json({ message: "Sala atualizada com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Excluir uma sala
  static async deleteSala(req, res) {
    const salaId = req.params.id;
    const queryDelete = `DELETE FROM salas WHERE id_salas = ?`;

    try {
      connect.query(queryDelete, [salaId], function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao excluir a sala" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }
        return res.status(200).json({ message: "Sala excluída com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
