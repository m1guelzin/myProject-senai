document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("formulario-registro")
    
    //Adiciona o ouvinte de evento (submit) para capturar o envio do formulario
    .addEventListener("submit", function (event) {
      //Previne o comportamento padrao do formulario, ou seja, impede que ele seja enviado e recarregue a pagina
      event.preventDefault();
  
      //Captura os valores dos campos do formularios
      const cpf = document.getElementById("cpf").value;
      const nome = document.getElementById("nome").value;
      const telefone = document.getElementById("telefone").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
  
      //Requisição HTTP para o endpoint de cadastro de usuario
      fetch("http://localhost:3000/project-senai/api/v1/user", {
        //Realiza uma chamada http para o servidor(a rota definida)
        method: "POST",
        headers: {
          //A requisição será em formato json
          "Content-Type": "application/json",
        },
        //Transforma os dados do formulario de uma string json para serem enviados no corpo da req
        body: JSON.stringify({ cpf, nome, telefone, email, senha }),
      })
        .then((response) => {
          //Tratamento da resposta do servidor / API
          if (response.ok) {
            //verifica se a resposta foi bem sucedida
            return response.json();
          }
          //Convertendo o erro em formato JSON
          return response.json().then((err) => {
            //Mensagem retornada do servidor acessada pela chave "error"
            throw new Error(err.error);
          });
        }) //Fechamento da then(response)
        .then((data) => {
          //executa a resposta de sucesso - retorna ao usuario final
  
          //Exibe um alerta para o usuario final (front) com o nome que acabou de ser cadastrado
          alert(data.message);
          //Exibe o log no terminal
          console.log("Usuario criado: ", data.user);
  
          //Reseta os campos do formulario após o sucesso do cadastro
          document.getElementById("formulario-registro").reset(); 
          window.location.href = "login.html";
        })
        .catch((error) => {
          //Captura qualquer erro que ocorra durante o processo de requisição / resposta
  
          //Exibe alerta (front) com o erro processado
          alert("Erro no cadastro " + error.message);
          console.error("Erro:", error.message);
        });
    });
  })

document.addEventListener("DOMContentLoaded", function(){
  // Acessa o objeto "Documento" que representa a página HTML
  document
    .getElementById("login-form")
    // Adiciona o ouvinte de evento (submit) para capturar o envio do formulário
    .addEventListener("submit", function (event) {
      // Previna o comportamento padrão do formulário
      event.preventDefault();

      // Captura os valores dos campos do formulário
      const cpf = document.getElementById("cpf").value;
      const senha = document.getElementById("senha").value;

      // Requisição HTTP para o endpoint de login
      fetch("http://localhost:3000/project-senai/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha }),
      })
        .then((response) => {
          // Tratamento da resposta do servidor / API
          if (response.ok) {
            return response.json();
          }
          // Convertendo o erro em formato JSON
          return response.json().then((err) => {
            throw new Error(err.error);
          });
        })
        .then((data) => {
          // Executa a resposta de sucesso
          
          console.log("Usuário Autenticado");

          // Armazenar o ID do usuário no localStorage após login bem-sucedido
          localStorage.setItem('userId', data.user.id_usuario);  // Supondo que a resposta contenha o "id" do usuário
          console.log(data.user.id_usuario)
          // Redireciona para a página inicial após o login bem-sucedido
          alert(data.message);
          window.location.href = "inicialPage.html";
        })
        .catch((error) => {
          // Captura qualquer erro que ocorra durante o processo de requisição / resposta
          alert("Erro no login: " + error.message);
          console.error("Erro:", error.message);
        });
    });
});
