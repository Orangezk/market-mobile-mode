import request from '@/utils/request'

export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode,
      deliver: 10,
      couponId: 0,
      isUserPoints: 0,
      ...obj
    }
  })
}

export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    deliver: 10,
    couponId: 0,
    isUserPoints: 0,
    payType: 10,
    ...obj
  })
}
// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}
