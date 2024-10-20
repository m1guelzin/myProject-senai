const connect = require("../db/connect");
module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, nome, telefone, email, senha } = req.body;

    if (!cpf || !nome || !telefone || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      // Construção da query INSERT
      const query = `INSERT INTO usuario (cpf, nome, telefone, email, senha) VALUES(
    '${cpf}',
    '${nome}',
    '${telefone}',
    '${email}',
    '${senha}')`;
      // Executando a query criada
      try {
        connect.query(query, function (err) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "O Email ja está vinculado a outro usuário" });
            } else {
              return res
                .status(500)
                .json({ error: "Erro interno do servidor" });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário cadastrado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return req.status(500).json({ error: "Erro interno do Servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de Usuários", users: results });
      });
    } 
    catch (error) {
      console.error("Erro ao executar consulta:", error)
      return res.status(500).json({error: "Erro interno do Servidor"})
    }
  }

  static async updateUser(req, res) {
    // Desestrutura e recupera os dados enviados via corpo da requisição
    const { cpf, nome, telefone, email, senha } = req.body;

    // Validar se todos os campos foram preenchidos
    if (!cpf || !nome || !telefone || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET cpf=?, nome=?, telefone=?, email=?, senha=? WHERE id_usuario = ?`;
    const values = [cpf, nome, telefone, email, senha];

    try{
      connect.query(query, values, function(err, results){
        if(err){
          if (err.code === "ER_DUP_ENTRY"){
            return res.status(400).json({error: "Email já cadastrado por outro usuário"});
          } else{
            console.error(err);
            res.status(500).json({error: "Erro interno do Servidor"})
          }
        }
        if(results.affectedRows === 0){
          return res.status(404).json({message: "Usuário não encontrado"});
        }
        return res.status(200).json({message: "Usuário atualizado com sucesso"});
      });
    }catch(error){
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({error: "Erro interno do Servidor"});
    }
  }

  static async deleteUser(req, res) {
    // Obtem o parametro 'id' da requisição, que é o cpf do user a ser deletado
    const userId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario=?`;
    const values = [userId];

    try{
      connect.query(query,values,function(err,results){
        if(err){
          console.error(err);
          return res.status(500).json({error: "Erro interno no servidor"});
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error: "Usuário não encontrado"});
        }
        return res.status(200).json({message:"Usuário excluido com sucesso"});
      });
    }catch(error){
      console.error(err);
      return res.status(500).json({error: "Erro interno do servidor"});
    }
  }
};
