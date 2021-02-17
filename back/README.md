# Youtube Search
API que realiza uma busca no Youtube, baseado em uma frase e informa:

- As 5 palavras mais utilizadas nos títulos e descrições.
- O tempo em dias, que o usuário levará para assistir todos os vídeos, informado sua limitação diária em minutos.
- Informações dos vídeos para que os mesmos possam ser reproduzidos em navegadores.

## Instala pacotes do projeto
```
npm install
```

### Executa hot-reload para ambiente de desenvolvimento
```
npm run start:dev
```

### Compila and minifica para produção
```
npm run build
```

### Executa os testes unitários
```
npm run test
```

### Executa lints e fixes
```
npm run lint
npm run lint:fix
```
### Informações para arquivo .env
É necessário alterar o arquivo .env na parte:
```
DATA_API_KEY=[YOUR_API_KEY]
````
onde YOUR_API_KEY deve ser substituido pela sua API KEY do Youtube.

Veja em [Youtube Data API](https://developers.google.com/youtube/v3).
