const loginForm = document.getElementById('formLogin');

    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const matricula = document.getElementById('matricula').value;
      const senha = document.getElementById('senha').value;

      const user = {
        matricula: matricula,
        senha: senha,
      };

      const url = 'http://localhost:3003/usuario/login';
      const token = 'QQ2023Tech5';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log('Usuário autenticado:');
          sessionStorage.setItem('userData', JSON.stringify(data));

          if(data.tipo_perfil === 'Administrador'){
            window.location.href = '../templates/Dashboard.html';
          }else{
            window.location.href = '../templates/gerenciarTemplate.html';
          }
          
        } else if (response.status === 403) {
          console.log('Acesso negado!');
          alert("Acesso negado!");
        
        } else {
          console.error('Erro no login:', response.status);
          alert("Login ou senha incorreta!");  
        }
      } catch (error) {
        console.error('Erro na solicitação de login:', error);
      }
      limparCampos();
    });

    function limparCampos() {
            const matricula = document.getElementById('matricula');
            const senha = document.getElementById('senha');

            matricula.value = '';
            senha.value = '';
        }