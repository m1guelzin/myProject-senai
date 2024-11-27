document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // Obtém o ID do usuário armazenado no localStorage
  
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
            option.textContent = `${reserva.nome_da_sala} - ${reserva.data_hora}`;
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
  