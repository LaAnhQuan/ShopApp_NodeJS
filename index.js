/** 
DB Diagram
https://dbdiagram.io/d/ShoppAppOnlineNodeJSReactJS-67ed7bee4f7afba18420470b

npx sequelize-cli init
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string


Run Migrations:
npx sequelize-cli db:migrate


npx sequelize-cli model:generate --name Category --attributes name:string,image:text
npx sequelize-cli model:generate --name Brand --attributes name:string,image:text

npx sequelize-cli model:generate --name News --attributes title:string,image:text,content:text
npx sequelize-cli model:generate --name Banner --attributes name:string,image:text,status:integer

Revert the most recent migration:
npx sequelize-cli db:migrate:undo

npx sequelize-cli db:migrate:undo:all

*/


