# 📚 ScreenOne

> Um projeto em **Java + Spring Boot** que roda direto no **terminal**, consumindo uma API externa para consultar, armazenar e explorar dados literários.

---

## ✨ Sobre o projeto

O **ScreenOne** é uma aplicação desenvolvida com foco em **aprendizado prático de Spring Boot**, organização de código e boas práticas de backend.

A aplicação permite ao usuário interagir por meio de um **menu no terminal**, realizando buscas, consultas e listagens relacionadas a livros e autores, com dados persistidos em banco de dados.

Este projeto nasceu como um estudo guiado, mas foi evoluindo para algo mais completo, com melhorias de arquitetura, experiência do usuário no terminal e integração com banco de dados.

---

## 🛠️ Tecnologias utilizadas

* **Java 17**
* **Spring Boot**
* **Spring Data JPA**
* **Hibernate**
* **PostgreSQL / MySQL** (dependendo do ambiente)
* **Consumo de API REST externa**
* **Maven**

---

## 📌 Funcionalidades

A aplicação oferece um menu interativo no terminal com as seguintes opções:

```
1 - Buscar livro pelo título
2 - Listar livros registrados
3 - Listar autores registrados
4 - Listar autores vivos em um determinado ano
5 - Listar livros por idioma
0 - Sair
```

### 🔍 O que é possível fazer

* Buscar livros por título usando uma API externa
* Persistir livros e autores no banco de dados
* Consultar livros já registrados
* Filtrar autores vivos em um determinado ano
* Listar livros por idioma

---

## 🧠 Conceitos aplicados

* Arquitetura em camadas (Controller / Service / Repository)
* Injeção de dependências com Spring
* Mapeamento de entidades com JPA
* Relacionamentos entre entidades
* Tratamento de erros
* Organização e legibilidade de código
* Menu interativo e experiência no terminal

---

## 🚀 Como executar o projeto

### Pré-requisitos

* Java 17 ou superior
* Maven
* Banco de dados configurado (PostgreSQL ou MySQL)

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/screenone.git
   ```

2. Configure o `application.properties` ou `application.yml` com os dados do banco:

3. Execute o projeto:

   ```bash
   mvn spring-boot:run
   ```

4. Interaja com o menu pelo terminal 🎉

---

## 📈 Próximos passos (roadmap)

* [ ] Refatoração e organização final de pacotes
* [ ] Implementação de **Spring Security**
* [ ] Criação de testes automatizados
* [ ] Melhorias visuais no menu do terminal
* [ ] Documentação da API consumida

---

## 💜 Autoria

Projeto desenvolvido por **Bia**, estudante de Engenharia de Software, como parte da jornada de aprendizado em backend com Java e Spring Boot.

> *"Aprender criando é o melhor caminho."*

---

Se você chegou até aqui, obrigada por conferir o projeto! ⭐
