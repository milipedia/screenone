import getDados from "./getDados.js";

// Mapeia os elementos DOM
const elementos = {
    top5: document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series: document.querySelector('[data-name="series"]')
};

// Função para criar carrossel com setas
function criarCarrossel(elemento, dados) {
    const ulExistente = elemento.querySelector('.carousel-wrapper');
    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }
    
    // Wrapper do carrossel
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    
    // Botão anterior
    const btnPrev = document.createElement('button');
    btnPrev.className = 'carousel-btn prev';
    btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    
    // Container dos cards
    const container = document.createElement('div');
    container.className = 'carousel-container';
    
    const ul = document.createElement('ul');
    ul.className = 'carousel-track';
    
    const listaHTML = dados.map((filme) => `
        <li class="carousel-item">
            <a href="detalhes.html?id=${filme.id}">
                <img src="${filme.poster}" alt="${filme.titulo}">
                <div class="card-overlay">
                    <h3>${filme.titulo}</h3>
                </div>
            </a>
        </li>
    `).join('');
    
    ul.innerHTML = listaHTML;
    container.appendChild(ul);
    
    // Botão próximo
    const btnNext = document.createElement('button');
    btnNext.className = 'carousel-btn next';
    btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    
    // Monta o carrossel
    wrapper.appendChild(btnPrev);
    wrapper.appendChild(container);
    wrapper.appendChild(btnNext);
    elemento.appendChild(wrapper);
    
    // Funcionalidade de scroll
    let scrollAmount = 0;
    const cardWidth = 256; // largura do card + gap (240px + 16px)
    
    btnNext.addEventListener('click', () => {
        const maxScroll = ul.scrollWidth - container.clientWidth;
        scrollAmount = Math.min(scrollAmount + cardWidth * 3, maxScroll);
        ul.style.transform = `translateX(-${scrollAmount}px)`;
    });
    
    btnPrev.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - cardWidth * 3, 0);
        ul.style.transform = `translateX(-${scrollAmount}px)`;
    });
}

// Função genérica para tratamento de erros
function lidarComErro(mensagemErro) {
    console.error(mensagemErro);
}

// Seletor de categorias
const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsParaOcultar = document.querySelectorAll('.section');

categoriaSelect.addEventListener('change', function () {
    const categoria = document.querySelector('[data-name="categoria"]');
    const categoriaSelecionada = categoriaSelect.value;
    
    if (categoriaSelecionada === 'todos') {
        for (const section of sectionsParaOcultar) {
            section.classList.remove('hidden');
        }
        categoria.classList.add('hidden');
    } else {
        for (const section of sectionsParaOcultar) {
            section.classList.add('hidden');
        }
        categoria.classList.remove('hidden');
        
        getDados(`/series/categoria/${categoriaSelecionada}`)
            .then(data => {
                criarCarrossel(categoria, data);
            })
            .catch(error => {
                lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
            });
    }
});

// Gera as séries principais
geraSeries();

function geraSeries() {
    const urls = ['/series/top5', '/series/lancamentos', '/series'];
    
    Promise.all(urls.map(url => getDados(url)))
        .then(data => {
            criarCarrossel(elementos.top5, data[0]);
            criarCarrossel(elementos.lancamentos, data[1]);
            criarCarrossel(elementos.series, data[2]);
            
            // Usa os lançamentos para o banner hero
            if (data[1] && data[1].length > 0) {
                iniciarBannerComSeries(data[1]);
            }
        })
        .catch(error => {
            lidarComErro("Ocorreu um erro ao carregar os dados.");
        });
}

// Sistema de banners rotativos com dados da API
let bannerIndex = 0;
let seriesBanner = [];
const hero = document.getElementById("hero");

function iniciarBannerComSeries(series) {
    seriesBanner = series.slice(0, 5); // Pega as 5 primeiras séries para rodar no banner
    
    if (seriesBanner.length > 0) {
        trocarBanner();
        setInterval(trocarBanner, 8000); // Troca a cada 8 segundos
    }
}

function trocarBanner() {
    if (seriesBanner.length === 0) return;
    
    // Fade out
    hero.classList.add('fade-out');
    
    setTimeout(() => {
        const serie = seriesBanner[bannerIndex];
        
        // Se a série não tem banner, usa o poster como background
        const backgroundImage = serie.banner || serie.poster;
        hero.style.backgroundImage = `url(${backgroundImage})`;
        
        // Atualiza o conteúdo
        const heroContent = hero.querySelector('.hero-content');
        heroContent.innerHTML = `
            <img src="${serie.poster}" alt="${serie.titulo}" class="hero-poster">
            <div class="hero-text">
                <div class="hero-category">${serie.genero || 'Série'}</div>
                <h2>${serie.titulo}</h2>
                <div class="hero-rating">
                    <span class="stars">★★★★★</span>
                    <span class="score">${serie.avaliacao || 'N/A'}/10</span>
                </div>
                <div class="hero-meta">
                    <span>${serie.totalTemporadas || '?'} Temporadas</span>
                </div>
                <p>${serie.sinopse || 'Sinopse não disponível.'}</p>
                <div class="hero-cast">
                    <h4>Elenco Principal</h4>
                    <p>${serie.atores || 'Elenco não informado'}</p>
                </div>
                <div class="hero-actions">
                    <button onclick="window.location.href='detalhes.html?id=${serie.id}'">▶ Assistir Agora</button>
                    <button class="secondary" onclick="window.location.href='detalhes.html?id=${serie.id}'">ℹ Mais Informações</button>
                </div>
            </div>
        `;
        
        bannerIndex = (bannerIndex + 1) % seriesBanner.length;
        
        // Fade in
        hero.classList.remove('fade-out');
    }, 500);
}

// Header com scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.cabecalho');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});