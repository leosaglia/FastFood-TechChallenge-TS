export interface CreateOrderUseCaseRequest {
  items: Array<{
    productId: string
    quantity: number
  }>
}
