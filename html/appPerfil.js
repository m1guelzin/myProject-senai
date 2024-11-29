// Obtém o ID do usuário armazenado no localStorage
const userId = localStorage.getItem('userId'); 
document.addEventListener('DOMContentLoaded', () => {

  if (userId) {
    // Fetch para obter os dados do usuário
    fetch(`http://localhost:3000/project-senai/api/v1/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          // Preenche os campos com os dados do usuário
          document.getElementById('nome').value = data.user.nome;
          document.getElementById('email').value = data.user.email;
          document.getElementById('telefone').value = data.user.telefone;
          document.getElementById('cpf').value = data.user.cpf;

          // Carrega as reservas do usuário
          carregarReservasUsuario(userId);
        } else {
          alert('Usuário não encontrado');
          window.location.href = 'login.html'; // Redireciona para a página de login
        }
      })
      .catch(error => {
        console.error('Erro ao buscar os dados do usuário:', error);
        alert('Erro ao carregar o perfil.');
      });
  } else {
    alert('Usuário não autenticado');
    window.location.href = 'login.html';
  }
});

function carregarReservasUsuario(userId) {
  // Fetch para obter as reservas do usuário
  fetch(`http://localhost:3000/project-senai/api/v1/user/${userId}/reservas`)
    .then(response => response.json())
    .then(data => {
      const selectReservas = document.getElementById('reservas');
      selectReservas.innerHTML = '<option value="" disabled selected>Minhas Reservas</option>';

      if (data.reservas && data.reservas.length > 0) {
        data.reservas.forEach(reserva => {
          const option = document.createElement('option');
          option.value = reserva.id_reserva;

          // Verificando se a data está em um formato compatível
          const dataReserva = new Date(reserva.data_hora);
          if (isNaN(dataReserva)) {
            console.error("Data inválida:", reserva.data_hora);
            return;  // Se a data não for válida, não adicionamos a reserva
          }

          // Formatando a data para "DD/MM/YYYY HH:MM"
          const dataFormatada = dataReserva.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Se quiser usar 24 horas, mantenha como `false`
          });

          // Definindo o texto do option com a data formatada, a data_fim e a duração tratada
          option.textContent = `${reserva.nome_da_sala} - ${dataFormatada}`;
          selectReservas.appendChild(option);
        });
      } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhuma reserva encontrada';
        selectReservas.appendChild(option);
      }
    })
    .catch(error => {
      console.error("Erro ao buscar reservas:", error);
      alert("Erro ao buscar reservas. Tente novamente.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("botao-deletar-conta").addEventListener("click", function () {
    // Exibe um modal de confirmação para o usuário
    const confirmDelete = confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.");

    if (!confirmDelete) return; // Se o usuário cancelar, encerra o processo
    const userId = localStorage.getItem("userId"); // Exemplo de onde o ID pode estar armazenado

    if (!userId) {
      alert("Erro: ID do usuário não encontrado.");
      return;
    }

    // Requisição HTTP para o endpoint de deletar usuário
    fetch(`http://localhost:3000/project-senai/api/v1/user/${userId}`, {
      method: "DELETE", // Método HTTP para deletar
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        // Convertendo o erro em formato JSON
        return response.json().then((err) => {
          throw new Error(err.error);
        });
      })
      .then((data) => {
        // Sucesso na exclusão
        alert(data.message); 
        console.log("Conta deletada: ", data);

        window.location.href = "login.html";
      })
      .catch((error) => {
        // Captura qualquer erro que ocorra durante o processo de requisição / resposta
        alert("Erro ao deletar a conta: " + error.message);
        console.error("Erro:", error.message);
      });
  });
});

