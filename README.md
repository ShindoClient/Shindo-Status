

<div align="center">
  <img src="assets/logo.png" style="width: 128px; height: auto;" alt="Shindo Logo">

  # Shindo API
  <div align="center" style="margin: 15px 0">
    <a href="#status" style="margin: 0 5px">
      <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status do Projeto">
    </a>
    <a href="#versão" style="margin: 0 5px">
      <img src="https://img.shields.io/badge/Version-1.0.0-007ACC?style=for-the-badge" alt="Versão">
    </a>
    <a href="#licença" style="margin: 0 5px">
      <img src="https://img.shields.io/badge/License-GPL3-38B2AC?style=for-the-badge" alt="Licença">
    </a>
  </div>
  <p align="center" style="margin-top: 20px">
    <strong>API moderna e escalável para o ecossistema Shindo</strong>
  </p>
</div>

## ✨ Recursos

- 🔍 Consulta de status do servidor em tempo real
- 📊 Métricas de desempenho detalhadas
- 🔒 Autenticação segura com JWT
- ⚡️ Resposta rápida com cache otimizado
- 📱 Design responsivo e compatível com múltiplos dispositivos

## 🛠️ Tecnologias

<div align="center">
    <a href="https://nuxt.com/">
      <img alt="Nuxt.js" src="https://img.shields.io/badge/Nuxt.js-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white">
    </a>
    <a href="https://www.typescriptlang.org/">
      <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
    </a>
    <a href="https://tailwindcss.com/">
      <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
    </a>
    <a href="https://vercel.com/">
      <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
    </a>
    <a href="https://jwt.io/">
      <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white">
    </a>
    <a href="https://nodejs.org/">
      <img alt="Node.js" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
    </a>
</div>

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/ShindoClient/Shindo-API.git
   cd Shindo-API
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env .env
   # Edite o arquivo .env com suas configurações
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

## 🌐 Endpoints

### `GET /api/status`
Retorna o status atual do servidor.

**Resposta de Sucesso (200 OK)**
```json
{
  "status": "online",
  "players": 42,
  "uptime": "2d 5h 30m",
  "version": "1.0.0"
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Adicione suas mudanças (`git add .`)
4. Comite suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Faça o Push da Branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request


---

<div align="center">
  <p>Feito com ❤️ pela ShindoCient Team</p>
  <p>© 2025 Shindo - Todos os direitos reservados</p>
</div>
