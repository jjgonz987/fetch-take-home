import { Hono } from 'hono'
import {z} from "zod"
import { zValidator } from '@hono/zod-validator'

import { nanoid } from 'nanoid';
import {purchaseSchema} from "./schema/items";
import {ErrorPostResponse, ReceiptNotFound, SuccessPostResponse} from "./shared/type";


const app = new Hono()

// Saving the data in memory
const db = new Map()


app.post('/receipts/process', zValidator('json', purchaseSchema), async (c) => {
  try {
    const validatedData = c.req.valid('json');
    const receiptId = nanoid();

    // Save the receipt
    db.set(receiptId, JSON.stringify(validatedData));


    // Return the ID in the response
    return c.json<SuccessPostResponse>({ id: receiptId }, 200);

  }
  catch(error) {
    if (error instanceof z.ZodError){
      return c.json<ErrorPostResponse>({description: "The receipt is invalid"})
    }
  }

});

app.get("/receipts/:id/points", async (c) => {
  const receiptId = c.req.param("id")

  if (!receiptId || !db.has(receiptId)) {
    return c.json<ReceiptNotFound>({message: "No receipt found for that id"}, 404)
  }
  let points = 0;
  const receipt = JSON.parse(db.get(receiptId));

  // Rule 1:
  points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;

  // Rule 2:
  if (Number(receipt.total) % 1 === 0) {
    points += 50;
  }

  // Rule 3:
  if (Number(receipt.total) % 0.25 === 0) {
    points += 25;
  }

  // Rule 4:
  points += Math.floor(receipt.items.length / 2) * 5;

  // Rule 5:
  receipt.items.forEach((item: { shortDescription: string; price: string }) => {
    const descriptionLength = item.shortDescription.trim().length;
    if (descriptionLength % 3 === 0) {
      points += Math.ceil(Number(item.price) * 0.2);
    }
  });

  // Rule 6:
  const purchaseDay = new Date(receipt.purchaseDate).getDate();
  if (purchaseDay % 2 !== 0) {
    points += 6;
  }

  // Rule 7:
  const [hour, minute] = receipt.purchaseTime.split(':').map(Number);
  if (hour === 14 || (hour === 15 && minute === 0)) {
    points += 10;
  }

  return c.json({points: points},200)

})

export default app
