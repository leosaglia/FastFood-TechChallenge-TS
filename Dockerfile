###################
# BUILD STAGE
###################
FROM node:18-alpine AS build

# Permissão mínima para rodar - criando novo usuário
RUN adduser --disabled-password --gecos "" appuser

USER appuser

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm ci

# Copiar o restante do código da aplicação para o diretório de trabalho
COPY . .

# Gerar os clients Prisma
RUN npx prisma generate

# Compilar o projeto TypeScript
RUN npm run build

# Utilizar somente dependências de produção. O nest é necessário somente para o build
RUN npm ci --only=production && npm cache clean --force

###################
# COPIAR SOMENTE O NECESSÁRIO PARA O CONTAINER
###################
FROM node:18-alpine AS production

# Permissão mínima para rodar - criando novo usuário
RUN adduser --disabled-password --gecos "" appuser

USER appuser

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar arquivos necessários para rodar a aplicação
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/.env ./
COPY --from=build /usr/src/app/src/adapter/driven/prisma ./src/adapter/driven/prisma

# Expor a porta que a aplicação irá rodar
EXPOSE ${PORT}

# Comando para iniciar a aplicação
CMD [ "npm", "run", "start:migrate:prod" ]