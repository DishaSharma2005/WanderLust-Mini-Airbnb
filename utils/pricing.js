const GST_RATE = 0.18;

function nightsBetween(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const ms = end - start;
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function priceBreakdown(nightlyPrice, nights, guests = 1) {
  const safeNights = Math.max(1, Number(nights) || 1);
  const base = Number(nightlyPrice || 0) * safeNights;
  const tax = Math.round(base * GST_RATE);
  const total = base + tax;
  return {
    nights: safeNights,
    guests: Number(guests) || 1,
    nightlyPrice: Number(nightlyPrice || 0),
    base,
    tax,
    total,
    gstRate: GST_RATE,
  };
}

function formatINR(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}

module.exports = {
  GST_RATE,
  nightsBetween,
  priceBreakdown,
  formatINR,
};
