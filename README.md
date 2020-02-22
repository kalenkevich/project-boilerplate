##Commands for using migrations:

***Firstly you need to install ts-node globaly***
> npm install -g ts-node
> npm install -g typescript

####Run migrations from ./src.migration folder;
> npm run migration:run 

####Revert migrations from ./src.migration folder;
> npm run migration:revert

####Create a migration;
> npm run migration:create MIGRATION_NAME
