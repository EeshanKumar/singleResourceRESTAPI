'use strict';


process.env.POSTGRES_DBNAME = 'dogs_test';
process.env.POSTGRES_DBUSER = 'dogs_test';
process.env.POSTGRES_DBPASS = 'foobar123';

var Sql = require('sequelize');
var sql = new Sql(process.env.POSTGRES_DBNAME || 'dogs_dev', 
	process.env.POSTGRES_DBUSER || 'dogs_dev', 
	process.env.POSTGRES_DBPASS || 'foobar123', {
	dialect: 'postgres'
});

var Dog = module.exports = sql.define('Dog', {
	name: Sql.STRING,
	breed: Sql.STRING
});

Dog.sync();