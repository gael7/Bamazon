CREATE DATABASE Bamazon_db;
USE Bamazon_db;
CREATE TABLE Products (
	ItemID INTEGER(10) AUTO_INCREMENT NOT NULL, 
	PRIMARY KEY (ItemID),
	ProductName VARCHAR(50),
	DepartmentName VARCHAR(50),
	Price DECIMAL(6,2),
	StockQuantity INTEGER(10)
);