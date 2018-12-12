import hello from '../utils/hello'
import ModalUser from '../modal/user'

// import crypto from '../utils/crypto'

const user  = new ModalUser()

function userAuth({userName, passWord}) {
  return user.findOne({userName, passWord})
}

/**
 * @POST：'/login' 登录验证
 * */
async function login(ctx, next) {
  const { userName, passWord } = ctx.request.body
  if(!userName) {
    ctx.send(2, '', '用户名不能为空')
    return
  }
  if(!passWord) {
    ctx.send(2, '', '密码不能为空')
    return
  }
  try {
    const result = await userAuth({userName, passWord})
    console.log('result', result)
    if(!result) {
      ctx.send(3,  '', '登录失败：账号或密码错误')
    } else {
      const userTokenInfo = {
        clientUser: result.userName,
        clientPass: result.passWord
      }
      ctx.cookies.set(
        'helloToken',
        hello.encodeLoginTypeJwt(userTokenInfo),
        {
          path: '/'
        }
      )
      ctx.send(1,  '', '登录成功')
    }
  } catch (e) {
    ctx.send(2,  '', hello.dealError(e))
  } finally {
    next()
  }
}

/**
 * @POST: '/user' 添加客户
 * */
async function add(ctx, next) {
  try{
    const { errMsg, filterData } = hello.filterParams(ctx.request.body, user.getSchema())
    if(errMsg) {
      ctx.send(2,  ctx.request.body, errMsg,)
    } else {
      const result = await user.save(filterData)
      ctx.send(1,  { id: result._id}, '')
    }
  } catch (e) {
    ctx.send(2,  '', hello.dealError(e, ctx.request.body.userName))
  } finally {
    next()
  }
}

/**
 * @GET: '/user' 获取用户列表
 * */
async function find(ctx, next) {
  console.log('ctx,id', ctx.state.userId)
  const { start, limit } = ctx.request.query
  // 如果没有提供start和limit则查找全部
  const findFn = (!start && !limit) ? user.list() : user.listWithPaging(start, limit)
  try{
    const result = await Promise.all([findFn, user.listCount()])
    console.log('result', result)
    ctx.send(1,  {
      data: result[0],
      count: result[1]
    }, '')
  } catch (e) {
    ctx.send(2,  '', hello.dealError(e))
  } finally {
    next()
  }
}

/**
 * @GET: '/user:id' 获取某个用户
 * */
async function findById(ctx, next) {
  const { id } = ctx.params
  if(!id) {
    ctx.send(2,  '', 'id不能为空')
  }
  try{
    const result = await user.findById(id)
    ctx.send(1,  result, '')
  } catch (e) {
    ctx.send(2,  '', hello.dealError(e, id))
  } finally {
    await next()
  }
}

/**
 * @DELETE: '/user' 删除用户
 * */
async function deleteById(ctx, next) {
  const { id } = ctx.request.body
  if(!id) {
    ctx.send(2,  '', 'id不能为空')
  }
  try{
    await user.del(id)
    ctx.send(1,  '删除成功', '')
  } catch (e) {
    ctx.send(2,  '', hello.dealError(e, id))
  } finally {
    await next()
  }
}

/**
 * @PUT: '/user' 修改用户
 * */
async function modify(ctx, next) {
  const { id } = ctx.request.body
  if(!id) {
    ctx.send(2,  '', 'id不能为空')
  }
  try{
    const result = await user.findOneAndUpdate(id, ctx.request.body)
    ctx.send(1,  result, '')
  } catch (e) {
    ctx.send(2,  '', hello.dealError(e, id))
  } finally {
    await next()
  }
}

export default {
  add,
  find,
  findById,
  modify,
  deleteById,
  login,
  userAuth
}
