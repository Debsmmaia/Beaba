//nome do botao perfil
const logout = document.getElementById('botSair');
const botaoDash = document.getElementById('botaoDash');
const botaoAdcUser = document.getElementById('botaoAdcUser');

logout.addEventListener('click', async () => {
  const url = 'http://localhost:3003/usuario/logout';
  const token = 'QQ2023Tech5';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      window.location.href = '/Front-end/paginas/logout.html';
    } else {
      console.error("Erro ao encerrar!");
    }
  } catch (error) {
    console.error("Erro");
  }
})




//conferir se o user é adm 

const userData = sessionStorage.getItem('userData');
const userDataS = JSON.parse(userData);
const tipo_perfil = userDataS.tipo_perfil;

const nome = userDataS.nome_funcionario;
const spanNomeUsuario = document.getElementById('botaoPerfil');
spanNomeUsuario.innerHTML = nome;

if (tipo_perfil === 'Administrador') {
  botaoDash.style.display = 'inline-block';
  botaoAdcUser.style.display = 'inline-block';
}


//pegar os usuarios

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
                <option> Administrativo </option>
                <option> Comum </option>
              </select>
            </td>
            <td class="direita">
              <button class="butExcluirUser" onclick="excluirUsuario(${user.idusuario})">Excluir</button>
            </td>
          </tr>
        </table>
      `;
      userList.appendChild(userDiv);

      const selectElement = userDiv.querySelector('.nivelAcessoSelect');
      selectElement.addEventListener('change', async (event) => {

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




async function buscarUser(user) {

  const url = `http://localhost:3003/usuario/buscaUsuarioId/${user}`;
  const token = 'QQ2023Tech5';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();

    if (responseData.usuario.nome_funcionario) {
      // console.log(responseData.usuario.nome_funcionario)
      return responseData.usuario.nome_funcionario;
    } else {
      throw new Error('Usuário não encontrado.');
    }
  } catch (error) {
    throw error;
  }
}


//puxar os dados de templates

async function renderizarTemplate() {
  const url = 'http://localhost:3003/template/templateGet';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const templateList = document.getElementById('templatesParaAprovacao');
    const templates = await response.json();

    for (const template of templates) {
      const usuario = await buscarUser(template.usuario);
      // console.log(template.idtemplate)

      const templateDiv = document.createElement('div');
      templateDiv.classList.add('templateDiv');
      templateDiv.innerHTML = `
        <table width="100%">
          <tr> 
            <td class="esquerda">
              <p> Nome do template: ${template.nome_template} </p>
            </td>
            <td class="esquerda">
              <p> Requisitante: ${usuario.nome_funcionario}</p>
            </td>
            <td class="centro">
              <p>Tipo de arquivo: ${template.tipo_arquivo}</p>
            </td>
            <td class="direita">
              <button class="butAprovar" id="aprovacao">Aprovar</button>
            </td>
            <td class="direita">
              <button class="butReprovar">Reprovar</button>
            </td>
          </tr>
        </table>
      `;
      templateList.appendChild(templateDiv);

    const aprovar = templateDiv.querySelector('.butAprovar');
    aprovar.addEventListener('click', async function(){

          const url = 'http://localhost:3003/template/aprovarTemplate';
          const templateAprovado = template.idtemplate;

          const aprovado = {
            "idtemplate": templateAprovado,
            "aprovacao": true,
          }
          
          try {
            const response = await fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(aprovado),
            });
            if (!response.ok) {
              throw Error(response.status);
            }
            const responseData = await response.json();
            console.log('Resposta do servidor:', responseData);
          } catch (error) {
            console.error('Erro ao atualizar o valor no banco de dados:', error);
          }

          try {
            const templateAprovadoDiv = document.getElementById('templateDiv');
            templateAprovadoDiv.style.display = 'none';
          } catch (error) {
            console.error("Ocorreu um erro ao ocultar a div:", error);
          }

          const templateDiv = this.closest('.templateDiv');
          if (templateDiv) {
            templateDiv.style.display = 'none';
          } else {
            console.error("A div associada ao botão não foi encontrada.");
          }
      });
    }

  } catch (error) {
    console.log('Erro ao fazer a requisição:', error.message);
  }
}

renderizarTemplate();