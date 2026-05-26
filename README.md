# 🎬 ScreenOne

Sistema fullstack para busca e gerenciamento de séries, consumindo a API OMDb e armazenando dados em PostgreSQL.

## ✨ Funcionalidades

- Buscar séries pela API OMDb
- Salvar séries no banco PostgreSQL
- Buscar episódios por temporada
- Listar séries cadastradas
- Buscar por ator
- Filtrar por gênero
- Top 5 séries
- Top 5 episódios
- Frontend integrado com backend Spring Boot
- API REST para consumo do frontend

---

# 🛠️ Tecnologias utilizadas

## Backend
- Java 25
- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven

## Frontend
- HTML5
- CSS3
- JavaScript

---

# 🗄️ Banco de Dados

O projeto utiliza PostgreSQL.

Configure o arquivo:

```properties
application.properties
```

Exemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost/screenone
spring.datasource.username=postgres
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# 🚀 Como executar o projeto

## Clone o repositório

```bash
git clone https://github.com/SEUUSUARIO/screenone.git
```

---

## Backend

Entre na pasta:

```bash
cd back-end
```

Execute:

```bash
./mvnw spring-boot:run
```

ou pelo IntelliJ.

O backend iniciará em:

```txt
http://localhost:8080
```

---

## Frontend

Abra a pasta `front-end` utilizando Live Server no VS Code.

O frontend será executado em algo como:

```txt
http://127.0.0.1:5500
```

---

# 🔗 Endpoints principais

## Listar séries

```http
GET /series
```

## Buscar série por título

```http
GET /series/buscar?titulo=house
```

---

# 📸 Preview

Em breve...

---

# 📚 Aprendizados

Este projeto foi desenvolvido durante o programa ONE (Oracle Next Education), com foco em desenvolvimento backend utilizando Java e Spring Boot, evoluindo posteriormente para uma aplicação fullstack com integração entre frontend, backend e banco de dados PostgreSQL.

Durante o desenvolvimento foram praticados:

- Arquitetura backend com Spring Boot
- Integração frontend + backend
- Consumo de APIs externas
- Persistência de dados com JPA/Hibernate
- Relacionamentos entre entidades
- Configuração de CORS
- Integração com PostgreSQL
---

# 👩‍💻 Desenvolvido por

Bia 💛
