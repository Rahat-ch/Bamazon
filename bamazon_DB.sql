DROP DATABASE IF EXISTS bamazon_DB;

CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (

	item_id INT NOT NULL AUTO_INCREMENT,
    product_Name VARCHAR (120),
    department_Name VARCHAR (120),
    price DECIMAL (6,3),
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)

);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Red Dead Redemption 2", "Video Games", 59.99, 10);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("MPC Drumkit", "Music Instruments", 399.99, 2);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Autobiography of Rahat Chowdhury", "Rare Items", 998.99, 1);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("PS4", "Video Games", 299.99, 8);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Spiderman Outfit", "Costumes", 74.35, 8);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Bagel", "Food", 0.85, 2);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Acoustic Guitar", "Music Instruments", 49.94, 9);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Infinity Gauntlet", "Deadly Weapons",120.25, 2);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Pokeball", "Pokemart", 100, 12);

INSERT INTO products (product_Name, department_Name, price, stock_quantity)
VALUES ("Harmonica", "Music Instruments", 29.95 , 30);



SELECT * FROM products;

