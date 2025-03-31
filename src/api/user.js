import request from '../utils/request'

export const login = (data) => {
  return request({
    url: '/api/login',
    method: 'post',

    data: data,
  })
}

export const updateUser = (user) => {
  return request({
    url: '/my/update',
    method: 'post',
    data: user,
  })
}

export const getuser = () => {
  return request({
    url: '/my/userinfo',
    method: 'get',
  })
}

//用户列表
export const getUserList = () => {
  return request({
    url: '/my/all',
    method: 'get',
  })
}

//删除一个用户
export const deleteUser = (id) => {
  return request({
    url: '/my/delete',
    method: 'post',
    data: { id },
  })
}

//注册一个用户
export const register = (data) => {
  console.log(data)

  return request({
    url: '/api/register',
    method: 'post',
    data: data,
  })
}
