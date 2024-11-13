const connect = require("../db/connect");

module.exports = class reservaController {
  static async createReserva(req, res) {
    const { fkcpf, fkid_salas, data_hora, duracao } = req.body;

    if (!fkcpf || !fkid_salas || !data_hora || !duracao) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const queryInsert = `
      INSERT INTO reservas (fkcpf, fkid_salas, data_hora, duracao) 
      VALUES ('${fkcpf}', '${fkid_salas}', '${data_hora}', '${duracao}')
    `;

    try {
      connect.query(queryInsert, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao criar a reserva" });
        }
        return res.status(201).json({ message: "Reserva criada com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllReservas(req, res) {
    const query = `SELECT * FROM reservas`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de Reservas", reservas: results });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateReserva(req, res) {
    const { id_reserva, fkcpf, fkid_salas, data_hora, duracao } = req.body;

    if (!id_reserva || !fkcpf || !fkid_salas || !data_hora || !duracao) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    }

    const queryUpdate = `
      UPDATE reservas 
      SET fkcpf=?, fkid_salas=?, data_hora=?, duracao=? 
      WHERE id_reserva = ?
    `;
    const values = [fkcpf, fkid_salas, data_hora, duracao, id_reserva];

    try {
      connect.query(queryUpdate, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Reserva não encontrada" });
        }
        return res.status(200).json({ message: "Reserva atualizada com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteReserva(req, res) {
    const reservaId = req.params.id;
    const queryDelete = `DELETE FROM reservas WHERE id_reserva=?`;
    const values = [reservaId];

    try {
      connect.query(queryDelete, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno no servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }
        return res.status(200).json({ message: "Reserva excluída com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
