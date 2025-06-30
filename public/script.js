//FUNÇÕES UTILITÁRIAS 
const mostrarErro = (input, mensagem) => {
  if (!input) return;
  input.classList.add('input-error');
  const span = input.nextElementSibling;
  if (span) {
    span.textContent = mensagem;
    span.style.display = 'block';
  }
};

const limparErro = (input) => {
  if (!input) return;
  input.classList.remove('input-error');
  const span = input.nextElementSibling;
  if (span) span.style.display = 'none';
};

const validarCampo = (input, minCaracteres = 3) => {
  if (!input) return false;
  const valido = input.value.trim().length >= minCaracteres;
  if (!valido) {
    mostrarErro(input, `Mínimo ${minCaracteres} caracteres`);
  }
  return valido;
};

const validarEmail = (input) => {
  if (!input) return false;
  
  const email = input.value.trim();
  console.log('Email sendo validado:', email); // DEBUG IMPORTANTE
  
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valido = regex.test(email);
  
  if (!valido) {
    console.log('Falha na validação para:', email); // DEBUG
    mostrarErro(input, "Formato inválido (ex: nome@provedor.com)");
  }
  
  return valido;
};

// ===== MÁSCARAS (mantidas pois são úteis) ===== //
const aplicarMascara = (input, pattern) => {
  if (!input) return;
  
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    let patternIndex = 0;
    
    for (let i = 0; i < value.length && patternIndex < pattern.length; i++) {
      if (pattern[patternIndex] === '9') {
        formatted += value[i];
        patternIndex++;
      } else {
        formatted += pattern[patternIndex];
        patternIndex++;
        i--;
      }
    }
    
    e.target.value = formatted;
  });
};

// ===== FORMULÁRIO DE INSCRIÇÃO ===== //
const configurarFormInscricao = () => {
  const form = document.getElementById('form-inscricao');
  if (!form) return;

  // Apenas máscaras (sem validação em tempo real)
  aplicarMascara(form.querySelector('#inscricao-cpf'), '999.999.999-99');
  aplicarMascara(form.querySelector('#inscricao-telefone'), '(99) 99999-9999');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpa erros anteriores
    form.querySelectorAll('.input-error').forEach(limparErro);

    const campos = {
      nome: form.querySelector('#inscricao-nome'),
      cpf: form.querySelector('#inscricao-cpf'),
      email: form.querySelector('#inscricao-email'),
      telefone: form.querySelector('#inscricao-telefone'),
      evento: form.querySelector('#inscricao-evento'),
      oficina: form.querySelector('#inscricao-oficina')
    };

    // Validação apenas no submit
    const valido = [
      validarCampo(campos.nome, 3),
      validarCampo(campos.cpf, 11),
      validarEmail(campos.email),
      validarCampo(campos.telefone, 11)
    ].every(Boolean);

    if (!valido) {
      alert("Verifique os campos destacados");
      return;
    }

    // Envio do formulário (mantido igual)
    try {
      const response = await fetch('/api/inscricao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: campos.nome.value,
          cpf: campos.cpf.value.replace(/\D/g, ''),
          email: campos.email.value,
          telefone: campos.telefone.value.replace(/\D/g, ''),
          evento: campos.evento.value,
          oficina: campos.oficina.value
        })
      });

      if (response.ok) {
        alert("Inscrição realizada!");
        form.reset();
      } else {
        alert("Erro no servidor");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão");
    }
  });
};

// ===== FORMULÁRIO DE DENÚNCIA ===== //
const configurarFormDenuncia = () => {
  const form = document.getElementById('form-denuncia');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpa erros anteriores
    form.querySelectorAll('.input-error').forEach(limparErro);

    const campos = {
      nome: form.querySelector('#denuncia-nome'),
      email: form.querySelector('#denuncia-email'),
      tipo: form.querySelector('#tipoDenuncia')
    };

    // Validação apenas no submit
    const valido = [
      validarCampo(campos.nome, 3),
      validarEmail(campos.email),
      campos.tipo.value ? true : (mostrarErro(campos.tipo, "Selecione um tipo"), false)
    ].every(Boolean);

    console.log('Resultados da validação:', {
  nome: validarCampo(campos.nome, 3),
  email: validarEmail(campos.email),
  tipo: campos.tipo.value ? true : false
    });

    if (!valido) {
      alert("Verifique os campos destacados");
      return;
    }

    // Envio do formulário
    try {
      const response = await fetch('/api/denunciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: campos.nome.value,
          email: campos.email.value,
          tipoDenuncia: campos.tipo.value
        })
      });

      if (response.ok) {
        alert("Denúncia registrada!");
        form.reset();
      } else {
        alert("Erro ao enviar denúncia");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão");
    }
  });
};

// ===== INICIALIZAÇÃO ===== //
document.addEventListener('DOMContentLoaded', () => {
  configurarFormInscricao();
  configurarFormDenuncia();
});