#!/bin/bash

# Root folder
mkdir -p src/{modules,shared,config,infrastructure/database/prisma,infrastructure/database/migrations}

# Modules
for module in auth user profile project media category technology interest expertise comment
do
  mkdir -p src/modules/$module/{application/use-cases,domain/entities,infrastructure/repositories,presentation/{controllers,dto}}
done

# Shared layer
mkdir -p src/shared/{constants,decorators,guards,interceptors,exceptions,utils}

# Config layer
mkdir -p src/config

# Infrastructure: Prisma
mkdir -p src/infrastructure/database/prisma
mkdir -p src/infrastructure/database/migrations
