package com.br.com.alura.ScreenOne.principal;

import com.br.com.alura.ScreenOne.model.*;
import com.br.com.alura.ScreenOne.repository.SerieRepository;
import com.br.com.alura.ScreenOne.service.ConsumoAPI;
import com.br.com.alura.ScreenOne.service.ConverteDados;
import com.br.com.alura.ScreenOne.model.Serie;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public class Principal {
    private Scanner leitura = new Scanner(System.in);
    private ConsumoAPI consumoApi = new ConsumoAPI();
    private ConverteDados conversor = new ConverteDados();
    private  List<DadosSerie> dadosSeries = new ArrayList<>();
    private final String ENDERECO = "https://www.omdbapi.com/?t=";
    private final String API_KEY = "&apikey=42d9b0b7";
    private SerieRepository repositorio;
    private List<Serie> series = new ArrayList<>();
    private Optional <Serie> serieBusca;

    public Principal(SerieRepository repositorio) {
        this.repositorio = repositorio;
    }

    public void exibeMenu() {
        var opcao = -1;
        while (opcao != 0) {
            var menu = """
                     1 - Buscar séries
                     2 - Buscar episódios
                     3 - Listar séries buscadas
                     4 - Buscar série pelo título
                     5 - Buscar série por ator
                     6 - Top 5 séries
                     7 - Pesquisa por gênero
                     8 - Filtrar séries
                     9 - Buscar por episódios
                     10 - Top 5 episódios de uma série\s
                    \s
                     0 - Sair                                \s
                    \s""";

            System.out.println(menu);
            opcao = leitura.nextInt();
            leitura.nextLine();

            switch (opcao) {
                case 1:
                    buscarSerieWeb();
                    break;
                case 2:
                    buscarEpisodioPorSerie();
                    break;
                case 3:
                    listarSeriesBuscadas();
                    break;
                case 4:
                    buscarSeriePorTitulo();
                    break;
                case 5:
                    buscarSeriePorAtor();
                    break;
                case 6:
                    buscarTop5Series();
                    break;
                case 7:
                    buscarSeriePorCategoria();
                    break;
                case 8:
                    filtrarSeriePorTemporadasEAvaliacao();
                    break;
                case 9:
                    buscarEpisodioPorTrecho();
                    break;
                case 10:
                    top5EpisodiosPorSerie();
                    break;
                case 11:
                    buscarEpisodioPorData();
                    break;
                case 0:
                    System.out.println("Saindo...");
                    break;
                default:
                    System.out.println("Opção inválida");
            }
        }
    }



    private void buscarSerieWeb() {
        DadosSerie dados = getDadosSerie();
        Serie serie = new Serie(dados);
//      dadosSeries.add(dados);
        repositorio.save(serie);
        System.out.println(dados);
    }

    private DadosSerie getDadosSerie() {
        System.out.println("Digite o nome da série para busca");
        var nomeSerie = leitura.nextLine();
        var json = consumoApi.obterDados(ENDERECO + nomeSerie.replace(" ", "+") + API_KEY);
        DadosSerie dados = conversor.obterDados(json, DadosSerie.class);
        return dados;
    }

    private void buscarEpisodioPorSerie() {
        listarSeriesBuscadas();
        System.out.println("Escolha uma série pelo nome: ");
        var nomeSerie = leitura.nextLine();

        Optional<Serie> serie = series.stream()
                .filter(s -> s.getTitulo().toLowerCase().contains(nomeSerie.toLowerCase()))
                .findFirst();

        if (serie.isPresent()) {

            var serieEncontrada = serie.get();
            List<DadosTemporada> temporadas = new ArrayList<>();

            // Busca temporadas na API
            for (int i = 1; i <= serieEncontrada.getTotalTemporada(); i++) {
                var json = consumoApi.obterDados(
                        ENDERECO + serieEncontrada.getTitulo().replace(" ", "+") +
                                "&season=" + i + API_KEY
                );
                DadosTemporada dadosTemporada = conversor.obterDados(json, DadosTemporada.class);
                temporadas.add(dadosTemporada);
            }

            temporadas.forEach(System.out::println);
            List<Episodio> episodios = new ArrayList<>();

            for (DadosTemporada t : temporadas) {
                for (DadosEpisodio e : t.episodios()) {
                    Episodio ep = new Episodio(t.numero(), e);

                    ep.setSerie(serieEncontrada);  // 
                    episodios.add(ep);
                }
            }

            serieEncontrada.setEpisodios(episodios);
            repositorio.save(serieEncontrada);

        } else {
            System.out.println("Série não encontrada.");
        }
    }


    private void listarSeriesBuscadas() {
        series = repositorio.findAll();
        series.stream()
                .sorted(Comparator.comparing(Serie::getGenero))
                .forEach(System.out::println);
    }

    private void buscarSeriePorTitulo() {
        System.out.println("Escolha uma série pelo nome:");
        var nomeSerie = leitura.nextLine();
        serieBusca = repositorio.findByTituloContainingIgnoreCase(nomeSerie);

        if (serieBusca.isPresent()){
            System.out.println("Dados da série: " + serieBusca.get());
        }else {
            System.out.println("Série não encontrada! :(");
        }
    }

    private void buscarSeriePorAtor() {
        System.out.println("Qual nome para busca: ");
        var nomeAtor = leitura.nextLine();
        List<Serie> seriesEncontradas =repositorio.findByAtoresContainingIgnoreCase(nomeAtor);
        System.out.println("Séries que " + nomeAtor + " trabalhou: ");
        seriesEncontradas.forEach( s ->
                System.out.println(s.getTitulo() + " avaliação: " + s.getAvaliacao()));
    }

    private void buscarTop5Series() {
        List<Serie> serieTop = repositorio.findTop5ByOrderByAvaliacaoDesc();
        serieTop.forEach( s ->
                System.out.println(s.getTitulo() + " avaliação: " + s.getAvaliacao()));
    }

    private void buscarSeriePorCategoria() {
        System.out.println("Qual gênero deseja pesquisar? ");
        var nomeGenero = leitura.nextLine();
        Categoria categoria = Categoria.fromPortugues(nomeGenero);
        List<Serie> seriesPorCategoria = repositorio.findByGenero(categoria);
        System.out.println("Séries da categoria: " + categoria + ":");
        seriesPorCategoria.forEach(System.out::println);
    }

    private void filtrarSeriePorTemporadasEAvaliacao() {
        System.out.println("Qual o número máximo de temporadas? ");
        var totalTemporadas = leitura.nextInt();
        System.out.println("Com avalição a partir de quanto?");
        var avaliacao = leitura.nextDouble();
        List<Serie> filtroSerie = repositorio.seriesPorTemporadaEAvaliacao(totalTemporadas, avaliacao);
        System.out.println("*** SÉRIES FILTRADAS ***");
        filtroSerie.forEach(
                s -> System.out.println(s.getTitulo() + " " + s.getTotalTemporada() + " temporadas" + " avaliação: " + s.getAvaliacao())
        );
    }

    private void buscarEpisodioPorTrecho() {
        System.out.println("Nome do episódio que deseja buscar: ");
        var trechoEpisodio = leitura.nextLine();
        List<Episodio> episodiosEncontrados = repositorio.episodioPorTrecho(trechoEpisodio);
        episodiosEncontrados.forEach(e ->
                System.out.printf("Série: %s Temporada: %s - Episódio %s = %s \n",
                        e.getSerie().getTitulo(), e.getTemporada(),
                e.getNumeroEpisodio(), e.getTitulo()));
    }

    private void top5EpisodiosPorSerie() {
        buscarSeriePorTitulo();
        if (serieBusca.isPresent()){
            Serie serie = serieBusca.get();
            List<Episodio> topEpisodios = repositorio.topEpisodiosPorSerie(serie);
            topEpisodios.forEach((e ->
                    System.out.printf("Série: %s Temporada: %s - Episódio %s = %s \n",
                            e.getSerie().getTitulo(), e.getTemporada(),
                            e.getNumeroEpisodio(), e.getTitulo())));
        }
    }

    private void buscarEpisodioPorData() {
    }

}
