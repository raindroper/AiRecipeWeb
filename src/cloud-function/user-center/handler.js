import { UserDbWrapper } from './userDbWrapper.js'
import { UserProfile } from './UserProfile.js'

let myHandler = async function (event, context, callback, logger) {
  // [LOG] 启动日志
  logger.info('>>> [STEP 0] Handler Entry (ESM Mode)')

  try {
    // [LOG] 打印环境信息
    logger.info(`>>> [STEP 0] Context RequestId: ${context.request_id}`)
    logger.info(`>>> [STEP 0] UserProfile Class Type: ${typeof UserProfile}`)
  } catch (e) {}

  let body = {}
  try {
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    } else {
      body = event
    }
    // [LOG] 请求体解析
    logger.info('>>> [STEP 1] Parsed Body: ' + JSON.stringify(body))
  } catch (e) {
    logger.error('>>> [STEP 1] JSON Parse Error: ' + e.message)
    return callback({ ret: { code: 400, desc: 'Invalid JSON' } })
  }

  const { action, userId, data } = body

  if (!userId) {
    logger.warn('>>> [STEP 1] Missing userId')
    return callback({ ret: { code: 400, desc: 'Missing userId' } })
  }

  let db
  try {
    // [LOG] 开始初始化 DB
    logger.info('>>> [STEP 2] New UserDbWrapper()...')
    db = new UserDbWrapper()
    logger.info('>>> [STEP 2] UserDbWrapper Initialized.')
  } catch (e) {
    logger.error('>>> [STEP 2] DB Init Failed: ' + e.message)
    logger.error(e.stack)
    return callback({ ret: { code: 500, desc: 'DB Init Failed: ' + e.message } })
  }

  try {
    if (action === 'get') {
      logger.info(`>>> [STEP 3] Action: GET user=${userId}`)
      const userList = await db.queryUser(userId)

      // [LOG] 查询结果
      logger.info(`>>> [STEP 4] Query Result Length: ${userList ? userList.length : 'null'}`)

      if (!userList || userList.length === 0) {
        return callback({ ret: { code: 404, desc: 'User not found' } })
      }
      const user = userList[0]
      user.password = undefined
      return callback({
        ret: { code: 0, desc: 'Success' },
        result: user,
      })
    } else if (action === 'update') {
      logger.info(`>>> [STEP 3] Action: UPDATE user=${userId}`)
      if (!data) return callback({ ret: { code: 400, desc: 'Missing data' } })

      const userList = await db.queryUser(userId)
      if (!userList || userList.length === 0) {
        return callback({ ret: { code: 404, desc: 'User not found' } })
      }
      const existingUser = userList[0]

      // [LOG] 准备 Merge
      logger.info('>>> [STEP 4] Merging data...')

      const newUser = new UserProfile()
      Object.assign(newUser, existingUser)
      delete data.id
      Object.assign(newUser, data)
      newUser.id = userId

      // [LOG] 执行 Upsert
      logger.info('>>> [STEP 5] Upserting...')
      await db.upsertUser(newUser)
      logger.info('>>> [STEP 5] Upsert Done.')

      newUser.password = undefined
      return callback({
        ret: { code: 0, desc: 'Update Success' },
        result: newUser,
      })
    } else {
      return callback({ ret: { code: 400, desc: 'Unknown action' } })
    }
  } catch (error) {
    logger.error('>>> [FINAL ERROR] System Error: ' + error.message)
    logger.error('>>> Stack: ' + error.stack)
    return callback({
      ret: { code: 500, desc: 'Server Error: ' + error.message },
    })
  }
}

export { myHandler }
