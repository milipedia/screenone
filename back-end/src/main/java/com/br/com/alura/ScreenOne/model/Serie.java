package com.br.com.alura.ScreenOne.model;

import com.br.com.alura.ScreenOne.service.traducao.ConsultaMyMemory;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "series")

public class Serie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String titulo;
    private Integer totalTemporada;
    private Double avaliacao;
    @Enumerated(EnumType.STRING)
    private Categoria genero;
    private String atores;
    private String poster;
    private String sinopse;

    @OneToMany(mappedBy = "serie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Episodio> episodios = new ArrayList<>();

    public Serie(){}

    public Serie(DadosSerie dadosSerie){
        this.titulo = dadosSerie.titulo();
        this.totalTemporada = dadosSerie.totalTemporadas();

        String avaliacaoStr = dadosSerie.avaliacao();
        if (avaliacaoStr == null || avaliacaoStr.isBlank() || avaliacaoStr.equalsIgnoreCase("N/A")) {
            this.avaliacao = 0.0;
        } else {
            try {
                this.avaliacao = Double.parseDouble(avaliacaoStr);
            } catch (Exception e) {
                this.avaliacao = 0.0;
            }
        }
        String generoStr = dadosSerie.genero();
        if (generoStr == null || generoStr.isBlank() || generoStr.equalsIgnoreCase("N/A")) {
            this.genero = Categoria.DESCONHECIDO;
        } else {
            String primeiroGenero = generoStr.split(",")[0].trim();
            this.genero = Categoria.fromString(primeiroGenero);
        }


        this.atores = dadosSerie.atores();
        this.poster = dadosSerie.poster();
        this.sinopse = ConsultaMyMemory.obterTraducao(dadosSerie.sinopse()).trim();
    }

    // getters e setters
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public Integer getTotalTemporada() { return totalTemporada; }
    public void setTotalTemporada(Integer totalTemporada) { this.totalTemporada = totalTemporada; }

    public Double getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Double avaliacao) { this.avaliacao = avaliacao; }

    public Categoria getGenero() { return genero; }
    public void setGenero(Categoria genero) { this.genero = genero; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }

    public String getSinopse() { return sinopse; }
    public void setSinopse(String sinopse) { this.sinopse = sinopse; }

    public String getAtores() { return atores; }
    public void setAtores(String atores) { this.atores = atores; }

    public Long getId() {

        return id;
    }

    public void setId(Long id) {
        this.id = id;
   }

    public List<Episodio> getEpisodios() {
        return episodios;
    }

    public void setEpisodios(List<Episodio> episodios) {
       episodios.forEach(e -> e.setSerie(this));
        this.episodios = episodios;
    }

    @Override
    public String toString() {
        return "\n--------------------------" +
                "\nTítulo: " + titulo +
                "\nGênero: " + genero +
                "\nTotal de temporadas: " + totalTemporada +
                "\nAvaliação: " + avaliacao +
                "\nAtores: " + atores +
                "\nSinopse: " + sinopse +
                "\nPoster: " + poster +
                "\nEpisódios: " + episodios +
                "\n--------------------------";
    }

}
