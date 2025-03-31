import request from '../utils/request'

export const getGoods_category = () => {
  return request({
    url: '/goods/getgood',
    method: 'get',
  })
}

export const getGoods_list = (parent_id) => {
  console.log(parent_id)

  return request({
    url: '/goods/getlist',
    method: 'post',
    data: parent_id,
  })
}

export const getGoods_add = (data) => {
  console.log(data)

  return request({
    url: '/goods/addgoodList',
    method: 'post',
    data,
  })
}

export const getGoods_del = (id) => {
  console.log(id)

  return request({
    url: '/goods/delList',
    method: 'post',
    data: { id: id },
  })
}

export const getGoods_update = (data) => {
  console.log(data)

  return request({
    url: '/goods/updateList',
    method: 'post',
    data,
  })
}

export const getGoods_search = (keyword) => {
  console.log(keyword)

  return request({
    url: '/goods/searchList',
    method: 'post',
    data:keyword,
  })
}
