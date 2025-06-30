const calendarId = 'ad4520be09379a4a32aac97e9e06dd2c871bbbc57c9433d997a3788819749c8f@group.calendar.google.com';
const apiKey = 'AIzaSyCYM5UKL5QSZb5UiEXE9T_SiPeeN3Fyf1g';

async function carregarEventosGoogle() {
  try {
    const eventosContainer = document.getElementById('eventos-container');
    const eventosSelect = document.getElementById('inscricao-evento');
    const oficinasSelect = document.getElementById('inscricao-oficina');

    if (!eventosContainer || !eventosSelect || !oficinasSelect) {
      console.error('Elementos do DOM não encontrados');
      return;
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${new Date().toISOString()}&orderBy=startTime&singleEvents=true`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', data); // Debug

    if (!data.items || data.items.length === 0) {
      eventosContainer.innerHTML = '<p>Nenhum evento agendado no momento.</p>';
      return;
    }

    // Limpa selects
    eventosSelect.innerHTML = '<option value="" disabled selected>Selecione</option>';
    oficinasSelect.innerHTML = '<option value="" disabled selected>Selecione</option>';

    data.items.forEach(evento => {
      const elementoEvento = criarElementoEvento(evento);
      eventosContainer.appendChild(elementoEvento);

      const option = new Option(evento.summary, evento.id);
      
      if (evento.summary.toLowerCase().includes('oficina')) {
        oficinasSelect.add(option);
      } else {
        eventosSelect.add(option);
      }
    });

  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
    const container = document.getElementById('eventos-container');
    if (container) {
      container.innerHTML = `
        <p class="error">Erro ao carregar eventos.</p>
        <button onclick="carregarEventosGoogle()">Tentar novamente</button>
      `;
    }
  }
}

function criarElementoEvento(evento) {
  const div = document.createElement('div');
  div.className = 'evento';
  
  const inicio = evento.start.dateTime || evento.start.date;
  const dataFormatada = new Date(inicio).toLocaleDateString('pt-BR');
  
  const { imagemHTML, textoDescricao } = extrairImagemEDescricao(evento.description || '');
  
  div.innerHTML = `
    <h3>${evento.summary}</h3>
    ${imagemHTML}
    <p>${textoDescricao}</p>
    <p><strong>Data:</strong> ${dataFormatada}</p>
    ${evento.location ? `<p><strong>Local:</strong> ${evento.location}</p>` : ''}
  `;
  
  return div;
}

function extrairImagemEDescricao(descricao) {
  const imgRegex = /(https?:\/\/[^\s"]+\.(?:png|jpg|jpeg|gif|webp))/i;
  const match = descricao.match(imgRegex);

  let imagemHTML = '';
  let textoDescricao = descricao;

  if (match) {
    imagemHTML = `<img src="${match[1]}" alt="Imagem do evento" style="width: 100%; max-width: 400px; height: 250px; object-fit: cover; border-radius: 12px; display: block; margin: 10px auto;" />`;
    textoDescricao = descricao.replace(match[0], '').trim();
  }

  return { imagemHTML, textoDescricao };
}

// Carrega os eventos quando a página estiver pronta
document.addEventListener('DOMContentLoaded', carregarEventosGoogle);