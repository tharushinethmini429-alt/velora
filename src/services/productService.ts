import type { Product } from "../context/ShopContext";
import { products as localProducts } from "../data/products";

const API_URL = "http://localhost:5000/api";

type DatabaseProduct = Omit<Product, "id" | "mongoId"> & {
    _id: string;
};

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products from the server");
    }

    const databaseProducts: DatabaseProduct[] = await response.json();

    console.table(
        databaseProducts.map((product) => ({
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
        }))
    );

    return databaseProducts.map((product, index) => ({
        ...product,

        id: localProducts.find(
            (localProduct) => localProduct.name === product.name
        )?.id ?? index + 1,
        
        mongoId: product._id,
    }));
}