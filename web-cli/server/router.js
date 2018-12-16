import * as Router from 'koa-router'
import hello from './utils/hello.js'
import userCtl from './controller/User.js'
import catalogCtl from './controller/Catalog.js'
import bookCtl from './controller/Book.js'
// userCtl.find()
const router = new Router({prefix: '/api'})

router.post('/login', userCtl.login)

router.get('/user', userCtl.find)
router.get('/user/:id', userCtl.findById)
router.delete('/user', userCtl.deleteById)
router.delete('/users', userCtl.deleteByIds)
router.put('/user', userCtl.modify)
router.post('/user', userCtl.add)

router.get('/book', bookCtl.find)
router.delete('/book', bookCtl.deleteById)
router.put('/book', bookCtl.modify)
router.post('/book', bookCtl.add)

router.get('/catalog', catalogCtl.find)
router.delete('/catalog', catalogCtl.deleteById)
router.put('/catalog', catalogCtl.modify)
router.post('/catalog', catalogCtl.add)

router.get('/qa', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.get('/qa/:id', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.delete('/qa', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.put('/qa/:id', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.post('/qa', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})

export default router
