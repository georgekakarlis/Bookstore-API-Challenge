/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - isbn
 *         - price
 *         - quantity
 *         - threshold
 *       properties:
 *         id:
 *           type: integer
 *           description: The book ID
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         isbn:
 *           type: string
 *           description: The ISBN of the book
 *         price:
 *           type: number
 *           description: The price of the book
 *         quantity:
 *           type: integer
 *           description: The quantity in stock
 *         threshold:
 *           type: integer
 *           description: The stock threshold
 */
export interface Book {
    id?: number; 
    title: string;
    author: string;
    isbn: string;
    price: number;
    quantity: number;
    threshold: number; 
  }