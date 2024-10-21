import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("La clé secrète Stripe n'est pas définie");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

export default stripe;
