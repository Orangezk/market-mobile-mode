import request from '@/utils/request'

export const getHome = () => {
  return request.get('/page/detail', {
    params: {
      pageId: 0
    }
  })
}
