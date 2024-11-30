# Inscrição Somar Formulário

Este repositório contém a documentação do formulário "Inscrição Somar". Este formulário foi desenvolvido para coletar informações dos usuários através de um processo estruturado de múltiplas etapas utilizando um `HorizontalStepper`. Abaixo, serão detalhados os componentes e as etapas que compõem o formulário.

## Estrutura do Formulário

O formulário "Inscrição Somar" consiste nas seguintes etapas:

### 1. Welcome
- Tela inicial que recepciona o usuário e fornece informações gerais sobre o formulário.

### 2. Jobs
- Informações sobre as vagas disponíveis para inscrição.
  - **JobItem**: Componente que exibe os detalhes de cada vaga, permitindo ao usuário escolher uma vaga de seu interesse.

### 3. Initial Data
- Coleta informações básicas do candidato, como nome, CPF, data de nascimento, entre outros.

### 4. Additional Data (Address)
- Coleta o endereço completo do candidato, incluindo rua, número, cidade, estado e CEP.

### 5. Additional Information 1
- Coleta informações complementares, como escolaridade, experiência profissional ou outros dados relevantes.

### 6. Additional Information 2
- Coleta informações adicionais mais específicas, como habilidades técnicas, idiomas falados, e outras informações que possam ser relevantes para a vaga.

### 7. Planning
- Coleta informações sobre a disponibilidade do candidato, como horários e dias da semana para trabalho, e perguntas relacionadas ao planejamento pessoal.

### 8. Data Confirmation
- Tela de confirmação dos dados inseridos pelo candidato. Nesta etapa, o usuário deve revisar todas as informações e confirmar sua exatidão.

### 9. Thank You Page
- Tela final que agradece ao usuário por completar o processo de inscrição. Pode conter informações adicionais sobre os próximos passos.

## Tecnologias Utilizadas
- **React**: Utilizado para construção do front-end do formulário.
- **Material-UI**: Utilizado para criar o `HorizontalStepper` e outros componentes de interface.
- **Vite**: Utilizado como ferramenta de build para o projeto React, proporcionando um ambiente de desenvolvimento rápido.
- **TypeScript**: Utilizado para aumentar a segurança e a escalabilidade do código.

## Configuração de React + TypeScript + Vite

Este template fornece uma configuração mínima para obter React funcionando no Vite com HMR e algumas regras do ESLint.

Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## Expansão da Configuração do ESLint

Se você estiver desenvolvendo uma aplicação de produção, recomendamos atualizar a configuração para habilitar regras de lint sensíveis ao tipo:

- Configure a propriedade `parserOptions` no nível superior da seguinte forma:

```js
export default tseslint.config({
  languageOptions: {
    // outras opções...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Substitua `tseslint.configs.recommended` por `tseslint.configs.recommendedTypeChecked` ou `tseslint.configs.strictTypeChecked`
- Opcionalmente, adicione `...tseslint.configs.stylisticTypeChecked`
- Instale [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) e atualize a configuração:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Defina a versão do React
  settings: { react: { version: '18.3' } },
  plugins: {
    // Adicione o plugin react
    react,
  },
  rules: {
    // outras regras...
    // Ative as regras recomendadas
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto:
   ```bash
   npm run dev
   ```

4. Acesse o formulário no navegador através de `http://localhost:3000`.

## Estrutura de Arquivos

Abaixo está uma breve descrição da estrutura de arquivos do projeto:

```
/
|-- src/
    |-- components/
        |-- HorizontalStepper/
            |-- Welcome.tsx
            |-- Jobs/
                |-- Jobs.tsx
                |-- JobItem.tsx
            |-- InitialData.tsx
            |-- AdditionalData.tsx
            |-- AdditionalInformation1.tsx
            |-- AdditionalInformation2.tsx
            |-- Planning.tsx
            |-- DataConfirmation.tsx
            |-- ThankYouPage.tsx
        |-- HorizontalStepper.tsx
    |-- App.tsx
    |-- main.tsx
    |-- index.css
```

## Contribuição

Contribuições são bem-vindas! Caso queira contribuir, por favor siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção de bug (`git checkout -b minha-feature`).
3. Commit suas mudanças (`git commit -m 'Minha nova feature'`).
4. Faça o push para sua branch (`git push origin minha-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
