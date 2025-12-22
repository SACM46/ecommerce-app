export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  stock?: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
  stock?: number;
}

export interface UpdateProductDto extends CreateProductDto {}