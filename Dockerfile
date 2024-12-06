# Use uma imagem base do Node.js para construir a aplicação
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência e instala as dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia todo o código-fonte e executa o build da aplicação
COPY . .
RUN npm run build

# Use Nginx para servir a aplicação em produção
FROM nginx:alpine

# Copia o build da aplicação para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx para configurar a porta
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta 3000 para acessar a aplicação
EXPOSE 3010

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]