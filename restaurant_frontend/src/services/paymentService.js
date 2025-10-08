function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// PUBLIC_INTERFACE
export const paymentService = {
  /** Simulate payment charge; randomly succeed. */
  async charge(amount, meta) {
    await sleep(800);
    // 90% success rate
    if (Math.random() < 0.9) return { id: 'pay_' + Math.random().toString(36).slice(2), amount, meta };
    throw new Error('Payment authorization failed. Please try again.');
  }
};
