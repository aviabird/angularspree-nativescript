import { STATIC_DATA } from "./static-data";

export const DEFAULT_CONFIG = {
  apiEndpoint: "https://ofypets.indiepet.co.in/",
  // apiEndpoint: "https://app.ofypets.com/",
  currency_symbol: "$",
  freeShippingAmount: 699,
  searchBoxPlaceholder: "Find the best for your pets...",
  logoUrl: "~/assets/logo.png",
  promoImageUrl: "~/assets/promo.png",

  ...STATIC_DATA
};
