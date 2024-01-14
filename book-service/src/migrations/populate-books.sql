INSERT INTO books (title, author, isbn, price, quantity, threshold)
VALUES 
('1984', 'George Orwell', '9780451524935', 9.99, 100, 10),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 14.99, 100, 10),
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 13.99, 100, 10),
('One Hundred Years of Solitude', 'Gabriel Garcia Marquez', '9780060883287', 12.99, 100, 10),
('A Brief History of Time', 'Stephen Hawking', '9780553380163', 18.99, 100, 10)
ON CONFLICT (isbn) DO NOTHING;