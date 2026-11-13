let ready;

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  ready ||= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    const timer = setTimeout(failed, 15000);
    function failed() {
      clearTimeout(timer);
      script.remove();
      reject(new Error("Checkout could not load. Try again."));
    }
    script.onload = () => {
      clearTimeout(timer);
      if (window.Razorpay) resolve(window.Razorpay);
      else failed();
    };
    script.onerror = failed;
    document.head.append(script);
  }).catch((error) => {
    ready = null;
    throw error;
  });
  return ready;
}

export async function openCheckout(order, customer) {
  const Razorpay = await loadCheckout();
  return new Promise((resolve) => {
    const checkout = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amountPaise,
      currency: order.currency,
      name: "Venuefy",
      description: "Venue booking advance",
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      handler: resolve,
      modal: { ondismiss: () => resolve(null) },
    });
    checkout.open();
  });
}
