export default class Product {
  id?: string;
  title: string;
  description?: string | null;
  price?: string | null;
  image?: string | null;
  url: string;
  created_at: Date;
  updated_at: Date;
}
