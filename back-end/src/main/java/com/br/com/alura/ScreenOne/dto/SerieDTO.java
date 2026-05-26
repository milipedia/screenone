package com.br.com.alura.ScreenOne.dto;

import com.br.com.alura.ScreenOne.model.Categoria;

public record SerieDTO(Long id,
    String titulo,
    Integer totalTemporada,
    Double avaliacao,
    Categoria genero,
    String atores,
    String poster,
    String sinopse)
{
}
