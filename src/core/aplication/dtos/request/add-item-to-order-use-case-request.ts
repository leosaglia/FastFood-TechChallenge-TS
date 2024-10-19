export interface AddItemToOrderUseCaseRequest {
  orderId: string
  productId: string
  quantity: number
}
