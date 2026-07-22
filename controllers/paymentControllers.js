import axios from "axios";

export const initializePaystackPayment = async (req, res) => {
  const { email, amount, metadata } = req.body;
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(amount * 100 * 1600), // Converted to NGN representation
        callback_url: `${process.env.FRONTEND_URL}/payment-verification`,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.status(200).json({ success: true, data: response.data.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPaystackPayment = async (req, res) => {
  const { reference } = req.params;
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );
    const { status, metadata } = response.data.data;
    if (status === "success") {
      // Process order fulfillment logic on Firebase here
      return res.status(200).json({ success: true, metadata });
    }
    return res
      .status(400)
      .json({ success: false, message: "Transaction failed." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
