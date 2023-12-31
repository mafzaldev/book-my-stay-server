const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

async function checkout({
  roomNo,
  price,
  image,
  checkIn,
  quantity,
  description,
  customerEmail,
  customerPhone,
  numberOfAdults,
  numberOfChildren,
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: roomNo,
            description: description + "Note: Quanity is number of days.",
            images: [image],
          },
          unit_amount: price * 100,
        },
        quantity: quantity,
      },
    ],
    mode: "payment",
    metadata: {
      roomNo,
      days: quantity,
      price,
      checkIn,
      customerEmail,
      customerPhone,
      numberOfAdults,
      numberOfChildren,
    },
    success_url: `${process.env.SERVER_URL}/customer/payment/{CHECKOUT_SESSION_ID}/`,
    cancel_url: `${process.env.SERVER_URL}/customer/payment/{CHECKOUT_SESSION_ID}`,
  });
  return session.url;
}

module.exports = {
  checkout,
};
