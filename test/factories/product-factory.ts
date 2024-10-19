import { Decimal } from 'decimal.js'

import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { EditProductUseCaseRequest } from '@core/aplication/dtos/request/edit-product-use-case-request'
import { RegisterProductUseCaseRequest } from '@core/aplication/dtos/request/register-product-use-case-request'

interface ProductProps {
  id: string
  name: string
  price: Decimal
  description: string
  category: Category
}

export function makeProduct({
  id = '1',
  name = 'Existing Product',
  price = new Decimal(100),
  description = 'Existing Description',
  category = new Category('Acompanhamento'),
}: Partial<ProductProps> = {}): Product {
  return new Product(name, price, description, category, id)
}

export function makeRegisterProductRequest(
  override: Partial<RegisterProductUseCaseRequest> = {},
): RegisterProductUseCaseRequest {
  return {
    name: 'Duplo Cheddar',
    price: new Decimal(100),
    description: 'Pão, carne, queijo, bacon, tomate, alface e maionese.',
    category: 'Lanche',
    ...override,
  }
}

export function makeEditProductRequest(
  override: Partial<EditProductUseCaseRequest> = {},
): EditProductUseCaseRequest {
  return {
    id: '1',
    name: 'Updated Product',
    price: new Decimal(150),
    description: 'Updated Description',
    category: 'Bebida',
    ...override,
  }
}
