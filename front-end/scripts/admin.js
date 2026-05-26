import getDados from "./getDados.js";

const API_URL = 'http://localhost:8080';

// Busca série na OMDB e salva no banco
window.buscarSerieOMDB = async function() {
    const titulo = document.getElementById('busca-titulo').value.trim();
    const resultadoDiv = document.getElementById('resultado-busca');
    
    if (!titulo) {
        mostrarMensagem(resultadoDiv, 'Por favor, digite o nome da série', 'error');
        return;
    }
    
    mostrarMensagem(resultadoDiv, 'Buscando série na OMDB...', 'loading');
    
    try {
        // Faz POST para buscar na OMDB e salvar
        // Remove espaços extras e codifica corretamente
        const tituloLimpo = titulo.trim();
        const response = await fetch(`${API_URL}/series/buscar?titulo=${encodeURIComponent(tituloLimpo)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const serie = await response.json();
            mostrarResultadoBusca(resultadoDiv, serie);
            document.getElementById('busca-titulo').value = '';
            
            // Recarrega a lista
            setTimeout(() => carregarSeries(), 1000);
        } else {
            mostrarMensagem(resultadoDiv, 'Série não encontrada na OMDB ou já existe no banco', 'error');
        }
    } catch (error) {
        console.error('Erro ao buscar série:', error);
        mostrarMensagem(resultadoDiv, 'Erro ao buscar série. Verifique a conexão.', 'error');
    }
};

// Mostra resultado da busca
function mostrarResultadoBusca(container, serie) {
    container.innerHTML = `
        <div class="resultado-card">
            <img src="${serie.poster}" alt="${serie.titulo}">
            <div class="resultado-info">
                <h3>${serie.titulo}</h3>
                <p><strong>Avaliação:</strong> ${serie.avaliacao}/10</p>
                <p><strong>Gênero:</strong> ${serie.genero}</p>
                <p><strong>Temporadas:</strong> ${serie.totalTemporadas}</p>
                <p><strong>Elenco:</strong> ${serie.atores}</p>
                <p><strong>Sinopse:</strong> ${serie.sinopse}</p>
            </div>
        </div>
        <div class="message success">
            <span class="material-symbols-outlined">check_circle</span>
            Série adicionada com sucesso!
        </div>
    `;
}

// Mostra mensagem
function mostrarMensagem(container, mensagem, tipo) {
    const icon = tipo === 'loading' ? '<div class="loading-spinner"></div>' :
                 tipo === 'success' ? '<span class="material-symbols-outlined">check_circle</span>' :
                 '<span class="material-symbols-outlined">error</span>';
    
    container.innerHTML = `
        <div class="message ${tipo}">
            ${icon}
            ${mensagem}
        </div>
    `;
}

// Carrega todas as séries
window.carregarSeries = async function() {
    const container = document.getElementById('lista-series');
    container.innerHTML = '<div class="message loading"><div class="loading-spinner"></div> Carregando séries...</div>';
    
    try {
        const series = await getDados('/series');
        
        if (series.length === 0) {
            container.innerHTML = '<div class="message">Nenhuma série cadastrada ainda.</div>';
            return;
        }
        
        container.innerHTML = series.map(serie => `
            <div class="serie-card">
                <img src="${serie.poster}" alt="${serie.titulo}">
                <div class="serie-card-info">
                    <h3 title="${serie.titulo}">${serie.titulo}</h3>
                    <div class="rating">
                        <span class="stars">★★★★★</span>
                        <span>${serie.avaliacao}/10</span>
                    </div>
                    <div class="serie-card-actions">
                        <button onclick="verDetalhes(${serie.id})" class="btn-secondary btn-small">
                            <span class="material-symbols-outlined">visibility</span>
                            Ver
                        </button>
                        <button onclick="deletarSerie(${serie.id}, '${serie.titulo}')" class="btn-danger btn-small">
                            <span class="material-symbols-outlined">delete</span>
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar séries:', error);
        container.innerHTML = '<div class="message error"><span class="material-symbols-outlined">error</span> Erro ao carregar séries</div>';
    }
};

// Ver detalhes da série
window.verDetalhes = function(id) {
    window.location.href = `/detalhes.html?id=${id}`;
};

// Deletar série
window.deletarSerie = async function(id, titulo) {
    if (!confirm(`Tem certeza que deseja excluir "${titulo}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/series/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert(`"${titulo}" foi excluída com sucesso!`);
            carregarSeries();
        } else {
            alert('Erro ao excluir série');
        }
    } catch (error) {
        console.error('Erro ao deletar série:', error);
        alert('Erro ao excluir série. Verifique a conexão.');
    }
};

// Carrega séries ao iniciar
carregarSeries();

// Busca ao pressionar Enter
document.getElementById('busca-titulo').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarSerieOMDB();
    }
});