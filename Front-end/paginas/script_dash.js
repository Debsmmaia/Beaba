fetch('http://localhost:3003/usuario/usuariosGet')
  .then((data) => {
    if (!data.ok) {
      throw Error(data.status);
    }
    return data.json();
  })
  .then((users) => {
    const userList = document.getElementById('tabelaUsuarios');

    users.forEach((user) => {
      const userDiv = document.createElement('div');
      userDiv.classList.add('usuarioDiv');
      userDiv.innerHTML = `
        <table width="100%">
          <tr> 
            <td class="esquerda">
              <p> Nome do funcionário: ${user.nome_funcionario} </p>
            </td>
            <td class="centro">
              <label for="nivelAcessoSelect">Nível de acesso: </label>
              <select class="nivelAcessoSelect" data-userid="${user.idusuario}">
                <option> ${user.tipo_perfil} </option>
                <option>Comum</option>
              </select>
            </td>
            <td class="direita">
              <button class="butExcluirUser" onclick="excluirUsuario(${user.idusuario})">Excluir</button>
            </td>
          </tr>
        </table>
      `;
      userList.appendChild(userDiv);

      const selectElement = userDiv.querySelector('.nivelAcessoSelect'); // Captura o elemento select específico
      selectElement.addEventListener('change', async (event) => {
      console.log('Evento de mudança acionado');

        const userId = selectElement.getAttribute('data-userid');
        const idusuario = parseInt(userId);
        console.log(idusuario);
        const novoValor = event.target.value;
        const url = 'http://localhost:3003/usuario/atualizarAcesso';
        const token = 'QQ2023Tech5';

        const userAtualizar = {
          "idusuario": idusuario,
          "tipo_perfil": novoValor,
        };

        try {
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userAtualizar),
          });
          if (!response.ok) {
            throw Error(response.status);
          }
          const responseData = await response.json();
          console.log('Resposta do servidor:', responseData);
        } catch (error) {
          console.error('Erro ao atualizar o valor no banco de dados:', error);
        }
      });
    });
  })
  .catch((e) => {
    console.error(e);
  });
 

function excluirUsuario(userId) {
  const url = 'http://localhost:3003/usuario/deletarUsuario';
  const token = 'QQ2023Tech5'; 

  const userExcluir = {
    "idusuario": userId,
  };

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userExcluir),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(responseData => {
    console.log('Resposta do servidor:', responseData);
  })
  .catch(error => {
    console.error('Erro ao fazer a requisição:', error);
  });
}

