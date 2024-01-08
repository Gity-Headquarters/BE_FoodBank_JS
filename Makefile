# seeder generate
npx sequelize-cli seed:generate --name create-initial-data

# up all
npx sequelize-cli db:seed:all

# undo all
npx sequelize-cli db:seed:undo:all

# migration generate
npx sequelize-cli migration:generate --name create-users-table

# up
npx sequelize-cli db:migrate

# down
npx sequelize-cli db:migrate:undo


