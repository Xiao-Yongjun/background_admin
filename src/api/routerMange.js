import request from '../utils/request'
//获取一级路由
export const routerMangeApi = () => {
  return request({
    url: '/router/category/one',
    method: 'get',
  })
}

//新增一级路由
export const addRouterMangeApi = (data) => {
  console.log(data)
  return request({
    url: '/router/category',
    method: 'post',
    data: data,
  })
}
//修改一级路由
export const updateRouterMangeApi = (data) => {
  console.log(data)

  return request({
    url: '/router/category/update',

    method: 'post',
    data: data,
  })
}
//删除一级路由
export const deleteRouterMangeApi = (id) => {
  return request({
    url: '/router/category/del',
    method: 'post',
    data: { id: id },
  })
}
//获取二级路由
export const getSecondRouter = (data) => {
  console.log(data)

  return request({
    url: '/router/category/Twolevel',
    method: 'post',
    data: data,
  })
}

//更新二级路由
export const updateSecondRouter = (data) => {
  console.log(data)

  return request({
    url: '/router/category/Twolevel/update',
    method: 'post',
    data: data,
  })
}
//删除二级路由
export const deleteSecondRouter = (id) => {
  console.log(id)

  return request({
    url: '/router/category/Twolevel/del',
    method: 'post',
    data: { id: id },
  })
}
//添加二级路由
export const addSecondRouter = (data) => {
  console.log(data)

  return request({
    url: '/router/category/Twolevel/add',
    method: 'post',
    data: data,
  })
}

//获取所有路由
export const getAllRouter = () => {
  return request({
    url: '/router/category/all',
    method: 'get',
  })
}
