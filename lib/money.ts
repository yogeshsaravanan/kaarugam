// Money is integer paise everywhere. Never floats.
export const rupees = (paise: number) =>
  "₹" + (paise / 100).toLocaleString("en-IN");
