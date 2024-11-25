const connect = require("../db/connect");

module.exports = class reservaController {
  static async createReserva(req, res) {
    const { fkcpf, fkid_salas, data_hora, duracao } = req.body;

    // Validações básicas
    if (!fkcpf || !fkid_salas || !data_hora || !duracao) {
      return res.status(400).json({
        error: "Todos os campos obrigatórios devem ser preenchidos",
      });
    }

    // Conversão de data e cálculo do horário de término
    const inicio = new Date(data_hora);
    const [duracaoHoras, duracaoMinutos, duracaoSegundos] = duracao
      .split(":")
      .map(Number);
    const duracaoMs =
      ((duracaoHoras * 60 + duracaoMinutos) * 60 +
        (duracaoSegundos || 0)) *
      1000;
    const fim = new Date(inicio.getTime() + duracaoMs);

    // Consulta para verificar conflitos
    const queryConflito = `
      SELECT * FROM reservas 
      WHERE fkid_salas = ? 
      AND (
        (? BETWEEN data_hora AND DATE_ADD(data_hora, INTERVAL TIME_TO_SEC(duracao) SECOND)) OR
        (? BETWEEN data_hora AND DATE_ADD(data_hora, INTERVAL TIME_TO_SEC(duracao) SECOND)) OR
        (data_hora BETWEEN ? AND ?)
      )
    `;
    const valuesConflito = [
      fkid_salas,
      inicio.toISOString(),
      fim.toISOString(),
      inicio.toISOString(),
      fim.toISOString(),
    ];

    connect.query(queryConflito, valuesConflito, (err, resultadosConflitos) => {
      if (err) {
        console.error("Erro ao verificar conflitos: ", err);
        return res.status(500).json({ error: "Erro ao verificar conflitos" });
      }

      // Se há conflitos, retorna erro
      if (resultadosConflitos.length > 0) {
        return res.status(409).json({
          error: "Conflito de horários para a sala selecionada",
        });
      }

      // Consulta para inserir reserva
      const queryInsert = `
        INSERT INTO reservas (fkcpf, fkid_salas, data_hora, duracao) 
        VALUES (?, ?, ?, ?)
      `;
      const valuesInsert = [
        fkcpf,
        fkid_salas,
        inicio.toISOString(),
        duracao,
      ];

      connect.query(queryInsert, valuesInsert, (err, result) => {
        if (err) {
          console.error("Erro ao inserir reserva: ", err);
          return res.status(500).json({ error: "Erro ao criar a reserva" });
        }

        // Reserva criada com sucesso
        return res.status(201).json({
          message: "Reserva criada com sucesso!",
          reservaId: result.insertId,
        });
      });
    });
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
