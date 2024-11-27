const connect = require("../db/connect");

module.exports = class reservaController {
  static async createReserva(req, res) {
    const { id_usuario, fkid_salas, data_hora, duracao } = req.body;

    if (!id_usuario || !fkid_salas || !data_hora || !duracao) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Ajustando o fuso horário para -3 (Brasil)
    const inicio = new Date(data_hora);
    inicio.setHours(inicio.getHours() - 3); // Subtraindo 3 horas

    const dataFormatada = inicio.toISOString().split("T")[0]; // "2024-12-01"
    const horaFormatada = inicio.toISOString().split("T")[1].split(".")[0]; // "19:30:00"
    const dataHoraFormatada = `${dataFormatada} ${horaFormatada}`;

    // Validação: não permitir reserva para dias anteriores ao atual
    const agora = new Date(); // Data e hora atual
    agora.setHours(agora.getHours() - 3); // Ajusta para o fuso horário -3

    if (inicio < agora) {
      return res
        .status(400)
        .json({ error: "Não é permitido fazer reservas em dias anteriores ao atual." });
    }

    // Cálculo do horário de término
    const [duracaoHoras, duracaoMinutos, duracaoSegundos] = duracao
      .split(":")
      .map(Number);
    const duracaoMs =
      ((duracaoHoras * 60 + duracaoMinutos) * 60 + (duracaoSegundos || 0)) *
      1000;
    const fim = new Date(inicio.getTime() + duracaoMs);

    // Verificando se há conflito de horário para a mesma sala
    const queryConflito = `
  SELECT * FROM reservas
  WHERE fkid_salas = ? 
  AND (
    (? >= data_hora AND ? <= DATE_ADD(data_hora, INTERVAL TIME_TO_SEC(duracao) SECOND)) OR
    (? >= data_hora AND ? <= DATE_ADD(data_hora, INTERVAL TIME_TO_SEC(duracao) SECOND)) OR
    (data_hora >= ? AND data_hora < ?)
  )
`;

    const valuesConflito = [
      fkid_salas,
      dataHoraFormatada, // Início da nova reserva
      dataHoraFormatada,
      fim.toISOString().replace("T", " ").split(".")[0], // Término da nova reserva
      fim.toISOString().replace("T", " ").split(".")[0],
      dataHoraFormatada,
      fim.toISOString().replace("T", " ").split(".")[0],
    ];

    try {
      connect.query(
        queryConflito,
        valuesConflito,
        (err, resultadosConflitos) => {
          if (err) {
            console.error("Erro ao verificar conflitos: ", err);
            return res
              .status(500)
              .json({ error: "Erro ao verificar conflitos" });
          }

          // Se houver conflitos de horário, retorna erro
          if (resultadosConflitos.length > 0) {
            return res.status(409).json({
              error: "Conflito de horários para a sala selecionada",
            });
          }

          // Se não houver conflitos, realiza a inserção da reserva
          const queryInsert = `
          INSERT INTO reservas (fkid_usuario, fkid_salas, data_hora, duracao)
          VALUES (?, ?, ?, ?)
        `;
          const valuesInsert = [
            id_usuario,
            fkid_salas,
            dataHoraFormatada,
            duracao,
          ];

          connect.query(queryInsert, valuesInsert, (err, result) => {
            if (err) {
              console.error("Erro ao criar reserva: ", err);
              return res.status(500).json({ error: "Erro ao criar reserva" });
            }

            return res.status(201).json({
              message: "Reserva criada com sucesso",
              reservaId: result.insertId,
            });
          });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getReservas(req, res) {
    const querySelect = `
      SELECT r.id_reserva, r.fkid_usuario, r.fkid_salas, r.data_hora, r.duracao, u.nome AS usuario_nome, s.nome_da_sala AS sala_nome
      FROM reservas r
      INNER JOIN usuario u ON r.fkid_usuario = u.id_usuario
      INNER JOIN salas s ON r.fkid_salas = s.id_salas
    `;

    try {
      connect.query(querySelect, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar reservas" });
        }

        return res
          .status(200)
          .json({ message: "Lista de Reservas", reservas: results });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getReservasByUser(req, res) {
    const { id_usuario } = req.params;

    const querySelect = `
      SELECT r.id_reserva, r.fkid_usuario, r.fkid_salas, r.data_hora, r.duracao, s.nome_da_sala AS sala_nome
      FROM reservas r
      INNER JOIN salas s ON r.fkid_salas = s.id_salas
      WHERE r.fkid_usuario = ?
    `;
    const valuesSelect = [id_usuario];

    try {
      connect.query(querySelect, valuesSelect, (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Erro ao buscar reservas do usuário" });
        }

        return res
          .status(200)
          .json({ message: "Reservas do usuário", reservas: results });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateReserva(req, res) {
    const { id_reserva, fkid_salas, data_hora, duracao } = req.body;

    if (!id_reserva || !fkid_salas || !data_hora || !duracao) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    }

// Ajustando o fuso horário para -3 (Brasil)
const inicio = new Date(data_hora);
inicio.setHours(inicio.getHours() - 3); // Subtraindo 3 horas para ajustar para o fuso horário Brasil

const dataFormatada = inicio.toISOString().split("T")[0]; // "2024-12-01"
const horaFormatada = inicio.toISOString().split("T")[1].split(".")[0]; // "19:30:00"
const dataHoraFormatada = `${dataFormatada} ${horaFormatada}`;

// Cálculo do horário de término
const [duracaoHoras, duracaoMinutos, duracaoSegundos] = duracao.split(":").map(Number);
const duracaoMs = ((duracaoHoras * 60 + duracaoMinutos) * 60 + (duracaoSegundos || 0)) * 1000;
const fim = new Date(inicio.getTime() + duracaoMs);

// Verificando se há conflito de horário para a mesma sala
const queryConflito = `
  SELECT * FROM reservas
  WHERE id_reserva != ? AND fkid_salas = ? 
  AND (
    (? >= data_hora AND ? < DATE_ADD(data_hora, INTERVAL duracao SECOND)) OR
    (? < data_hora AND DATE_ADD(?, INTERVAL duracao SECOND) > data_hora)
  )
`;

const valuesConflito = [
  id_reserva, // Exclui a própria reserva do conflito
  fkid_salas, // Sala que está sendo reservada
  dataHoraFormatada, // Início da nova reserva
  dataHoraFormatada,
  fim.toISOString().replace("T", " ").split(".")[0], // Término da nova reserva
  fim.toISOString().replace("T", " ").split(".")[0], // Término da nova reserva
];

try {
  connect.query(queryConflito, valuesConflito, (err, resultadosConflitos) => {
    if (err) {
      console.error("Erro ao verificar conflitos: ", err);
      return res.status(500).json({ error: "Erro ao verificar conflitos" });
    }

    // Se houver conflitos de horário, retorna erro
    if (resultadosConflitos.length > 0) {
      return res.status(409).json({
        error: "Conflito de horários para a sala selecionada",
      });
    }

    // Se não houver conflitos, realiza a atualização da reserva
    const queryUpdate = `
      UPDATE reservas
      SET fkid_salas = ?, data_hora = ?, duracao = ?
      WHERE id_reserva = ?
    `;
    const valuesUpdate = [fkid_salas, dataHoraFormatada, duracao, id_reserva];

    connect.query(queryUpdate, valuesUpdate, (err, results) => {
      if (err) {
        console.error("Erro ao atualizar reserva: ", err);
        return res.status(500).json({ error: "Erro ao atualizar reserva" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Reserva não encontrada" });
      }

      return res.status(200).json({ message: "Reserva atualizada com sucesso" });
    });
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor" });
}
}


  static async deleteReserva(req, res) {
    const { id_reserva } = req.params;

    const queryDelete = `DELETE FROM reservas WHERE id_reserva = ?`;
    const valuesDelete = [id_reserva];

    try {
      connect.query(queryDelete, valuesDelete, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao excluir reserva" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Reserva não encontrada" });
        }

        return res
          .status(200)
          .json({ message: "Reserva excluída com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
