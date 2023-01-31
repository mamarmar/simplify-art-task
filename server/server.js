import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.API_KEY;
const stripe = Stripe(apiKey, {
  apiVersion: "2020-08-27",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "stripe-samples/accept-a-payment/custom-payment-flow",
    version: "0.0.2",
    url: "https://github.com/stripe-samples",
  },
});

app.use(express.json());
app.use(cors());

app.post("/create-card", async (req, res) => {
  const cardInfo = req.body;
  cardInfo.exp_month = parseInt(cardInfo.exp_month);
  cardInfo.exp_year = parseInt(cardInfo.exp_year);

  try {
    const token = await stripe.tokens.create({
      card: cardInfo,
    });
    const customer = await stripe.customers.create();
    const card = await stripe.customers.createSource(customer.id, {
      source: token.id,
    });
    res.status(200).send(card);
  } catch (e) {
    switch (e.type) {
      case "StripeCardError":
        res.status(400).send(`A payment error occurred: ${e.message}`);
        break;
      case "StripeInvalidRequestError":
        res.status(401).send("An invalid request occurred.");
        break;
      default:
        res
          .status(402)
          .send("Another problem occurred, maybe unrelated to Stripe.");
        break;
    }
  }
});

app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
