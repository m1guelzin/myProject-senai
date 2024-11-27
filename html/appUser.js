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
