import { ProductRepository } from '../repositories/product-repository'
import { OrderRepository } from '../repositories/order-repository'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { Either, failure, success } from '@core/error-handling/either'
import { Product } from '@core/domain/entities/product'
import { Order } from '@core/domain/entities/order'

type FindOrdersUseCaseResponse = Either<
  NoMappedError | ResourceNotFoundError,
  {
    orders: Array<{
      order: Order
      products: Product[]
    }>
  }
>

export class FindOrdersUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(): Promise<FindOrdersUseCaseResponse> {
    try {
      const orders = await this.orderRepository.findMany()
      const ordersWithItemsAndProducts: {
        order: Order
        products: Product[]
      }[] = []

      for (const order of orders) {
        const allOrderProducts = await Promise.all(
          order.getItems().map(async (item) => {
            const product = await this.productRepository.findById(
              item.getProductId().toString(),
            )

            if (!product)
              throw new ResourceNotFoundError(
                `Product with id ${item.getProductId().toString()} not found`,
              )

            return product
          }),
        )

        ordersWithItemsAndProducts.push({
          order,
          products: allOrderProducts,
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
