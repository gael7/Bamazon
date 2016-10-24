USE Bamazon_db;
CREATE TABLE Departments (
	DeparmentID INTEGER(10), 
	PRIMARY KEY (DepartmentID),
	DeparmentName VARCHAR(50),
	OverHeadCosts INTEGER(50),
	TotalSales DECIMAL(10,2));