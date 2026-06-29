import { products } from "@/data/products";

export const getProductIds = () => products.map((product) => product.id);

export const getProductById = (productId: string) =>
  products.find((product) => product.id === productId);

export const getRelatedProducts = (productId: string, limit = 4) => {
  const product = getProductById(productId);

  if (!product) {
    return [];
  }

  const scoredProducts = products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      const sharedKeywords = candidate.keywords.filter((keyword) =>
        product.keywords.includes(keyword),
      ).length;
      const sameCategory = candidate.category === product.category ? 4 : 0;
      const sameBrand = candidate.brand === product.brand ? 3 : 0;

      return {
        product: candidate,
        score: sameCategory + sameBrand + sharedKeywords + candidate.rating,
      };
    })
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);

  return scoredProducts.slice(0, limit).map((item) => item.product);
};
