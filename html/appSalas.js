document.addEventListener("DOMContentLoaded", getAllSalas);

function getAllSalas() {
  fetch("http://localhost:3000/project-senai/api/v1/salas", {
    method: "GET",
    headers: {
      "Content-Type": "application/JSON",
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
      const salaLista = document.getElementById("salas-list");
      // Limpa a lista antes de Adicionar novos itens
      salaLista.innerHTML = "";
      // Verifica se há usuario retornados e os adiciona a tabela
      data.salas.forEach((sala) => {
        // Cria uma nova linha
        const tr = document.createElement("tr");

        const tdnome_da_sala= document.createElement("td");
        tdnome_da_sala.textContent = sala.nome_da_sala ;
        tr.appendChild(tdnome_da_sala);
          
        const tdcapacidade = document.createElement("td");
        tdcapacidade.textContent = sala.capacidade;
        tr.appendChild(tdcapacidade);

        const tdlocalizacao= document.createElement("td");
        tdlocalizacao.textContent = sala.localizacao;
        tr.appendChild(tdlocalizacao);

        const tdequipamentos = document.createElement("td");
        tdequipamentos.textContent = sala.equipamentos;
        tr.appendChild(tdequipamentos);

        salaLista.appendChild(tr);
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