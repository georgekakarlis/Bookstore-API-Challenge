import express, { Request, Response, Express } from 'express';
import path from 'path';
import { migrate, populateBooks, query } from './db/database';
import { Book } from './models/book';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app: Express = express();
const port = 3000;

migrate();
populateBooks();
app.use(express.json());

// ---------        SWAGGER DOCS         ---------
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bookstore Challenge',
    version: '1.0.0',
    description: 'API & UI for managing books in a bookstore',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files where swagger-jsdoc will look for annotations
  apis: ['./src/index.ts', './src/models/book.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files
app.use(express.static(path.join(__dirname, 'client')));


// Serve 'index.html' for the root route '/'
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});


/**
 * @swagger
 * /book:
 *   get:
 *     summary: Retrieve a list of all books
 *     description: Get a list of all books available in the bookstore. This endpoint does not require any parameters.
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: An error occurred while fetching the books.
 */
app.get('/book', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM books');
    res.status(200).json(result.rows);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});

//post books to the service. it is pre-populated but we can add as many as we want
/**
 * @swagger
 * /book:
 *   post:
 *     summary: Add a new book to the bookstore
 *     description: Allows the addition of a new book to the bookstore inventory. Requires details of the book.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The book has been successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error occurred while adding the book.
 */
app.post('/book', async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, price, quantity, threshold }: Book = req.body;
    const result = await query(
      // returning all data inserted, even the auto-generated ID to be efficient in speed than using a SELECT afterwards.
      // docs : https://www.postgresql.org/docs/current/dml-returning.html
      'INSERT INTO books (title, author, isbn, price, quantity, threshold) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, author, isbn, price, quantity, threshold]
    );
      // result rows if we want to send back to the client the array as an object. 0 because we want the one/first that just got into the db
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error adding book', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});

// GET a single book based on id
/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Retrieve a specific book by its ID
 *     description: Fetches a book from the bookstore database using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the book to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A book object with detailed information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID supplied.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error occurred while fetching the book.
 */
app.get('/book/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const result = await query('SELECT * FROM books WHERE id = $1', [id]);

    // if no rows were affected by this query then return a not found
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    // if yes return the first one you find
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching book', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});

//delete book based on id
/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Delete a book by its ID
 *     description: Removes a book from the bookstore database using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the book to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Confirmation message of the deleted book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Book deleted'
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID supplied.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error occurred while deleting the book.
 */
app.delete('/book/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const result = await query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted', book: result.rows[0] });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error deleting book', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});

// edit book based on id
/**
 * @swagger
 * /book/{id}:
 *   put:
 *     summary: Update a book's information by its ID
 *     description: Allows updating the details of a specific book in the bookstore database using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the book to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Book Title"
 *               author:
 *                 type: string
 *                 example: "Updated Author Name"
 *               isbn:
 *                 type: string
 *                 example: "1234567890123"
 *               price:
 *                 type: number
 *                 example: 15.99
 *               quantity:
 *                 type: integer
 *                 example: 20
 *               threshold:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: The book has been successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID supplied.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error occurred while updating the book.
 */
app.put('/book/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const { title, author, isbn, price, quantity, threshold }: Book = req.body;

    const result = await query(
      'UPDATE books SET title = $1, author = $2, isbn = $3, price = $4, quantity = $5, threshold = $6 WHERE id = $7 RETURNING *',
      [title, author, isbn, price, quantity, threshold, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    //    ---------------          NOTIFIER SERVICE API CALL     ---------------------
    // Check if quantity is below threshold on the database and send notification by POSTing to the notifier-service
    if (quantity < threshold) {
      const notificationResponse = await fetch('http://localhost:4000/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: req.params.id,
          title: title,
          remainingQuantity: quantity
        })
      });

      if (!notificationResponse.ok) {
        throw new Error(`HTTP error! status: ${notificationResponse.status}`);
      }
      // part of the FETCH API is to manually handle the return from a call. so in this point if there is less threshold (than 10) and the 
      // notifier-service is about to send a notification we take printed to the console : 
      // Notification: Book 1984 (ID: 1) is running low. Remaining Quantity: 9
      // Notification sent: { message: 'Notification sent successfully' }
      const notifyResult = await notificationResponse.json();
      console.log('Notification sent:', notifyResult);
    }

    res.status(200).json({ message: 'Book updated', book: result.rows[0] });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error updating book', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

