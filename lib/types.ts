export type Category = "Traditional" | "Modern" | "Marriage" | "Casual & Others";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // paise
  base: string;
  border: string;
  pallu: string;
  pattern: "plain" | "temple" | "check";
  blurb: string;
  stock?: number;
  imagePath?: string | null;
}

export interface Design {
  base: string;
  border: string;
  pallu: string;
  pattern: string;
  text?: string;
  textColor?: string;
}

export interface CartLine {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  design: Design;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  design: Design | null;
}

export interface Order {
  id: string;
  amount: number;
  currency: string;
  status: string;
  stage: number;
  provider: string;
  created_at: string;
  items: OrderItem[];
}

export interface ReviewRow {
  name: string;
  rating: number;
  text: string;
  created_at: string;
}
