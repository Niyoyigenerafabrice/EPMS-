-- SIMS Database Setup
CREATE DATABASE IF NOT EXISTS SIMS;
USE SIMS;

-- Users table (for login/auth)
CREATE TABLE IF NOT EXISTS Users (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Spare_Part table
CREATE TABLE IF NOT EXISTS Spare_Part (
  sparePartId INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  quantity INT NOT NULL,
  unitPrice DECIMAL(10,2) NOT NULL,
  totalPrice DECIMAL(10,2) NOT NULL
);

-- Stock_In table
CREATE TABLE IF NOT EXISTS Stock_In (
  stockInId INT AUTO_INCREMENT PRIMARY KEY,
  stockInQuantity INT NOT NULL,
  stockInDate DATE NOT NULL,
  sparePartId INT,
  FOREIGN KEY (sparePartId) REFERENCES Spare_Part(sparePartId)
);

-- Stock_Out table
CREATE TABLE IF NOT EXISTS Stock_Out (
  stockOutId INT AUTO_INCREMENT PRIMARY KEY,
  stockOutQuantity INT NOT NULL,
  stockOutUnitPrice DECIMAL(10,2) NOT NULL,
  stockOutTotalPrice DECIMAL(10,2) NOT NULL,
  stockOutDate DATE NOT NULL,
  sparePartId INT,
  FOREIGN KEY (sparePartId) REFERENCES Spare_Part(sparePartId),
  userId INT,
  FOREIGN KEY (userId) REFERENCES Users(userId)
);
