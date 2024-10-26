import Decimal from 'decimal.js'
import { Order } from '@core/domain/entities/order'
import { OrderItem } from '@core/domain/entities/orderItem'
import { OrderStatus } from '@core/domain/enums/order-status'

describe('Order', () => {
  let order: Order
  let item1: OrderItem
  let item2: OrderItem

  beforeEach(() => {
    order = new Order()
    item1 = new OrderItem('product1', order.getId(), new Decimal(50), 2)
    item2 = new OrderItem('product2', order.getId(), new Decimal(30), 1)
  })

  it('should create an order instance', () => {
    expect(order).toBeInstanceOf(Order)
    expect(order.getId()).toBeDefined()
    expect(order.getStatus()).toBe(OrderStatus.CREATED)
    expect(order.getItems()).toEqual([])
  })

  it('should add an item to the order', () => {
    order.addItem(item1)
    expect(order.getItems()).toContain(item1)
  })

  it('should update an existing item in the order', () => {
    order.addItem(item1)
    order.addItem(item1)

    expect(
      order
        .getItems()
        .find((item) => item.equals(item1))
        ?.getQuantity(),
    ).toBe(4)
  })

  it('should calculate the total price of the order', () => {
    order.addItem(item1)
    order.addItem(item2)
    const total = item1.getTotal().add(item2.getTotal())
    expect(order.getTotal()).toStrictEqual(total)
  })

  it('should get the order ID', () => {
    const id = order.getId()
    expect(id).toBe(order.getId())
  })

  it('should get the items in the order', () => {
    order.addItem(item1)
    order.addItem(item2)
    expect(order.getItems()).toEqual([item1, item2])
  })

  it('should get the status of the order', () => {
    expect(order.getStatus()).toBe(OrderStatus.CREATED)
  })
})
