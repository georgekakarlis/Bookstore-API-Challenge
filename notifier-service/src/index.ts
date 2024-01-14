import express, { Request, Response } from 'express';


type NotifyRequestBody = {
  bookId: number;
  title: string;
  remainingQuantity: number;
};

const app = express();
const port = 4000;

app.use(express.json());

// it only listens on /notify because we want this service to just tell us if we have low stock on books
app.post('/notify', (req: Request, res: Response) => {
  const { bookId, title, remainingQuantity } = req.body as NotifyRequestBody;
  
  console.log(`Notification: Book ${title} (ID: ${bookId}) is running low. Remaining Quantity: ${remainingQuantity}`);
  
  // Here we would implement the actual notification logic
  // by sending an email,sms etc. Some kind of cron-job maybe? eg : https://github.com/georgekakarlis/web-tracker-server/blob/56eef83059d03cd075769ee0ee7ac32d8a0afefa/src/index.js#L81
  // for now, it just logs to the console

  res.status(200).json({ message: 'Notification sent successfully' });
});

app.listen(port, () => {
  console.log(`Notifier service running at http://localhost:${port}`);
});
