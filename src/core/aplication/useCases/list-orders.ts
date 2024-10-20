import Decimal from 'decimal.js'
import { ProductRepository } from '../repositories/product-repository'
import { OrderRepository } from '../repositories/order-repository'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { Either, failure, success } from '@core/error-handling/either'

type OrderItemWithProductDetails = {
  productId: string
  productName: string
  productCategory: string
  price: Decimal
  quantity: number
}

type OrderWithItemsAndProducts = {
  order: {
    id: string
    status: string
    total: Decimal
    createdAt: Date
    updatedAt: Date
    orderItems: OrderItemWithProductDetails[]
  }
}

type ListOrderUseCaseResponse = Either<
  NoMappedError | ResourceNotFoundError,
  { orders: OrderWithItemsAndProducts[] }
>

export class ListOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(): Promise<ListOrderUseCaseResponse> {
    try {
      const orders = await this.orderRepository.list()
      const ordersWithItemsAndProducts: OrderWithItemsAndProducts[] = []

      for (const order of orders) {
        const itemsWithProducts = await Promise.all(
          order.getItems().map(async (item) => {
            const product = await this.productRepository.findById(
              item.getProductId().toString(),
            )

            if (!product)
              throw new ResourceNotFoundError(
                `Product with id ${item.getProductId().toString()} not found`,
              )

            return {
              productId: item.getProductId().toString(),
              productName: product.getName(),
              productCategory: product.getCategory().getValue(),
              price: item.getProductPrice(),
              quantity: item.getQuantity(),
            }
          }),
        )

        ordersWithItemsAndProducts.push({
          order: {
            id: order.getId().toString(),
            status: order.getStatus(),
            total: order.getTotal(),
            createdAt: order.getCreatedAt(),
            updatedAt: order.getUpdatedAt(),
            orderItems: itemsWithProducts,
          },
        })
      }

      return success({ orders: ordersWithItemsAndProducts })
    } catch (error) {
      if (error instanceof ResourceNotFoundError)
        return failure(new ResourceNotFoundError(error.message))
      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
