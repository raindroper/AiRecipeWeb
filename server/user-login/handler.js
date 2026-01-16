const path = require('path')
const { UserProfile } = require('./models/UserProfile')

let cloudDBInstance = null

async function getCloudDB() {
  if (cloudDBInstance) return cloudDBInstance
  try {
    // Server SDK for Cloud DB
    const { AGConnectCloudDB, CloudDBZoneConfig } = require('@agconnect/database-server')
    const credentialPath = path.join(__dirname, 'agc-apiclient.json')
    cloudDBInstance = AGConnectCloudDB.getInstance(credentialPath)
    // Open zone QuickStart
    const zoneConfig = new CloudDBZoneConfig('QuickStart')
    await cloudDBInstance.openCloudDBZone(zoneConfig)
    return cloudDBInstance
  } catch (e) {
    throw e
  }
}

exports.handler = async (data) => {
  try {
    const payload = data && typeof data === 'object' ? data : {}
    const phone = payload.phone
    const password = payload.password

    if (!phone || !password) {
      return { code: 400, message: '缺少必要参数' }
    }

    const cloudDB = await getCloudDB()
    const {
      CloudDBZoneQuery,
    } = require('@agconnect/database-server')

    const query = CloudDBZoneQuery.where(UserProfile).equalTo('id', phone)
    const zone = cloudDB.getCloudDBZone('QuickStart')
    const res = await zone.executeQuery(query)
    const list = res && res.getSnapshotObjects ? res.getSnapshotObjects(UserProfile) : []
    const user = list && list.length ? list[0] : null

    if (!user || user.password !== password) {
      return { code: 401, message: '账号或密码错误' }
    }

    user.password = null
    return { code: 0, message: 'ok', data: user }
  } catch (e) {
    return { code: 500, message: e?.message || '服务器错误' }
  }
}
