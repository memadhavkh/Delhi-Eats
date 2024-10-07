import { Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";
import { IMenu, CustomRequest, CheckoutSessionRequest } from "../types/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getOrders = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.find({ user: req.id })
      .populate("user")
      .populate("restaurant");
    res.status(200).json({ success: true, order });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
};

export const createCheckoutSession = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    // Fetch the restaurant without populating menus (menus are no longer needed)
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      res.status(404).json({ success: false, message: "Restaurant not found" });
      return;
    } else {
      const order = new Order({
        restaurant: restaurant._id,
        user: req.id,  // Assuming this is extracted from a token or similar mechanism
        deliveryDetails: checkoutSessionRequest.deliveryDetails,
        cartItems: checkoutSessionRequest.cartItems,
        status: "pending",
      });

      // Create line items directly from cart items
      const lineItems = createLineItems(checkoutSessionRequest);
      // Create the Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_address_collection: {
          allowed_countries: ["IN", "US"],
        },
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/order/status`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        metadata: {
          orderId: order._id.toString(),
        },
      });
      if (!session.url) {
        res.status(400).json({
          success: false,
          message: "Error While Creating Session",
        });
        return;
      }try {
        await order.save();
      } catch (error) {
        console.log(error)
      }
      res.status(200).json({
        success: true,
        message: "Checkout Session Created Successfully",
        session: session,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while creating checkout session",
    });
  }
};

export const stripeWebHook = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  let event: Stripe.Event;

  try {
    const signature = req.headers["stripe-signature"];
    // construct the payload string for verification
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

    // generate test header string for event construction
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    // construct the event using the payload string and header
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  // handle the checkout session completion event
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await Order.findById(session.metadata?.orderId);
      if (!order) {
        res.status(404).json({ message: "Order not found", success: false });
        return;
      } else {
        if (session.amount_total) {
          order.totalAmount = session.amount_total;
        }
        order.status = "confirmed";
        await order.save();
        return;
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
        return;
    }
  }
  res.status(200).send();
  return;
};

export const createLineItems = (
  checkOutSessionRequest: CheckoutSessionRequest
) => {
  // create line items directly from the cart items in the request
  const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: cartItem.name,  // use cartItem's name
          images: [cartItem.image],  // use cartItem's image
        },
        unit_amount: cartItem.price * 100,  // use cartItem's price
      },
      quantity: cartItem.quantity,  // use cartItem's quantity
    };
  });

  // return line items
  return lineItems;
};