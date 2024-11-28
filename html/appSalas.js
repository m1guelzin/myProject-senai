document.addEventListener("DOMContentLoaded", getAllSalas);

function getAllSalas() {
  fetch("http://localhost:3000/project-senai/api/v1/salas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
    .then((data) => {
      const salasList = document.getElementById("salas-list");
      salasList.innerHTML = ""; // Limpa a lista existente

      // Itera sobre as salas e cria um item para cada uma
      data.salas.forEach((sala) => {
        const salaDiv = document.createElement("div");
        salaDiv.classList.add("sala");

        const nomeSala = document.createElement("p");
        nomeSala.innerHTML = `<strong>Nome da Sala:</strong> ${sala.nome_da_sala}`;

        const capacidadeSala = document.createElement("p");
        capacidadeSala.innerHTML = `<strong>Capacidade:</strong> ${sala.capacidade}`;

        const localizacaoSala = document.createElement("p");
        localizacaoSala.innerHTML = `<strong>Localização:</strong> ${sala.localizacao}`;

        // Adiciona as informações da sala à div
        salaDiv.appendChild(nomeSala);
        salaDiv.appendChild(capacidadeSala);
        salaDiv.appendChild(localizacaoSala);

        // Adiciona a div da sala à lista
        salasList.appendChild(salaDiv);
      });
    })
    .catch((error) => {
      alert("Erro ao obter salas: " + error.message);
      console.error("Erro: ", error.message);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os elementos com a classe 'sala'
  const salas = document.querySelectorAll('.sala');

  // Adiciona o evento de clique para cada sala
  salas.forEach(sala => {
      sala.addEventListener('click', function() {
          // Obtém o ID da sala clicada
          const idSala = sala.getAttribute('data-id');
          console.log(`Você clicou na sala com ID: ${idSala}`);
          // Aqui, podemos adicionar a lógica para mostrar as informações da sala
      });
  });
});