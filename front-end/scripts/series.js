import getDados from "./getDados.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescricao = document.getElementById('ficha-descricao');

// Função para carregar temporadas
function carregarTemporadas() {
    getDados(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            listaTemporadas.innerHTML = '';
            
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione a temporada';
            listaTemporadas.appendChild(optionDefault); 
           
            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = `Temporada ${temporada}`;
                listaTemporadas.appendChild(option);
            });
            
            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas as temporadas';
            listaTemporadas.appendChild(optionTodos); 
        })
        .catch(error => {
            console.error('Erro ao obter temporadas:', error);
            mostrarErro('Não foi possível carregar as temporadas.');
        });
}

// Função para carregar episódios de uma temporada
function carregarEpisodios() {
    const valorSelecionado = listaTemporadas.value;
    
    if (!valorSelecionado) {
        fichaSerie.innerHTML = '<div class="episodios-empty">Selecione uma temporada para ver os episódios</div>';
        return;
    }
    
    // Mostra loading
    fichaSerie.innerHTML = '<div class="episodios-empty">Carregando episódios...</div>';
    
    getDados(`/series/${serieId}/temporadas/${valorSelecionado}`)
        .then(data => {
            if (data.length === 0) {
                fichaSerie.innerHTML = '<div class="episodios-empty">Nenhum episódio encontrado</div>';
                return;
            }
            
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            fichaSerie.innerHTML = ''; 
            
            temporadasUnicas.forEach(temporada => {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';
                
                const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);
                
                const listaHTML = episodiosTemporadaAtual.map(serie => `
                    <li>
                        <strong>Episódio ${serie.numeroEpisodio}</strong> - ${serie.titulo}
                    </li>
                `).join('');
                
                ul.innerHTML = listaHTML;
                
                const blocoTemporada = document.createElement('div');
                blocoTemporada.className = 'bloco-temporada';
                
                const tituloTemporada = document.createElement('h4');
                tituloTemporada.textContent = `Temporada ${temporada}`;
                
                blocoTemporada.appendChild(tituloTemporada);
                blocoTemporada.appendChild(ul);
                fichaSerie.appendChild(blocoTemporada);
            });
        })
        .catch(error => {
            console.error('Erro ao obter episódios:', error);
            fichaSerie.innerHTML = '<div class="episodios-empty">Erro ao carregar episódios. Tente novamente.</div>';
        });
}

// Função para carregar informações da série
function carregarInfoSerie() {
    getDados(`/series/${serieId}`)
        .then(data => {
            fichaDescricao.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" />
                <div>
                    <h1>${data.titulo}</h1>
                    <div class="rating-badge">
                        <span class="stars">★★★★★</span>
                        <span class="score">${data.avaliacao}/10</span>
                    </div>
                    <div class="descricao-texto">
                        <p><b>Sinopse:</b>${data.sinopse}</p>
                        <p><b>Elenco:</b>${data.atores}</p>
                        <p><b>Gênero:</b>${data.genero || 'Não informado'}</p>
                        <p><b>Total de temporadas:</b>${data.totalTemporadas || 'N/A'}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao obter informações da série:', error);
            fichaDescricao.innerHTML = '<div class="episodios-empty">Erro ao carregar informações da série.</div>';
        });
}

// Função para mostrar erros
function mostrarErro(mensagem) {
    fichaSerie.innerHTML = `<div class="episodios-empty">${mensagem}</div>`;
}

// Adiciona ouvinte de evento para o elemento select
listaTemporadas.addEventListener('change', carregarEpisodios);

// Carrega as informações da série e as temporadas quando a página carrega
carregarInfoSerie();
carregarTemporadas();

// Header com scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.cabecalho');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});