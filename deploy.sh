#!/bin/bash

# Habilitar modo estrito para lidar com erros
set -euo pipefail

# Função para verificar erros
check_error() {
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao executar o comando: $1"
        exit 1
    fi
}

# Função para exibir mensagem de status
log_message() {
    echo "------------------------------------------------------------"
    echo "👉 $1"
    echo "------------------------------------------------------------"
}

# Parar container existente
log_message "Parando o container 'pd-somar' (se estiver em execução)..."
docker stop pd-somar 2>/dev/null || echo "Nenhum container em execução."
check_error "docker stop pd-somar"

# Remover container existente
log_message "Removendo o container 'pd-somar'..."
docker rm pd-somar 2>/dev/null || echo "Nenhum container para remover."
check_error "docker rm pd-somar"

# Remover imagem associada
log_message "Removendo imagem associada ao 'pd-somar'..."
docker ps -a | grep pd-somar | awk '{print $2}' | xargs -r docker image rm -f
check_error "docker image rm"

# Construir nova imagem
log_message "Construindo nova imagem 'pd-somar'..."
docker build -t pd-somar .
check_error "docker build"

# Rodar novo container
log_message "Iniciando novo container 'pd-somar'..."
docker run -d \
    --name pd-somar \
    --hostname pd-somar \
    --restart always \
    -p 3000:3000 \
    pd-somar
check_error "docker run"

# Exibir logs do container
log_message "Exibindo logs do container 'pd-somar'..."
docker logs pd-somar
check_error "docker logs"

log_message "✅ Deploy concluído com sucesso!"
