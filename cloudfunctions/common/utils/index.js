const crypto = require('crypto')
const https = require('https')

const TOKEN_EXPIRE = 30 * 24 * 60 * 60 * 1000 // token 有效期 30 天

/**
 * 统一响应格式
 */
function success(data = {}) {
	return { code: 0, ...data }
}

function error(message, code = -1) {
	return { code, message }
}

/**
 * 生成随机 token
 */
function createToken() {
	return crypto.randomBytes(32).toString('hex')
}

/**
 * 获取 token 过期时间
 */
function getTokenExpire() {
	return Date.now() + TOKEN_EXPIRE
}

/**
 * HTTP GET 请求
 */
function httpsGet(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			let data = ''
			res.on('data', (chunk) => {
				data += chunk
			})
			res.on('end', () => {
				try {
					resolve(JSON.parse(data))
				} catch (e) {
					resolve(data)
				}
			})
		}).on('error', reject)
	})
}

/**
 * 微信 code2session
 */
async function getWxSession(code, appid, secret) {
	const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
	return await httpsGet(url)
}

/**
 * 解密微信加密数据（手机号）
 */
function decryptWxData(sessionKey, encryptedData, iv) {
	const sessionKeyBuffer = Buffer.from(sessionKey, 'base64')
	const encryptedBuffer = Buffer.from(encryptedData, 'base64')
	const ivBuffer = Buffer.from(iv, 'base64')

	const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyBuffer, ivBuffer)
	decipher.setAutoPadding(true)
	let decoded = decipher.update(encryptedBuffer, 'binary', 'utf8')
	decoded += decipher.final('utf8')

	return JSON.parse(decoded)
}

/**
 * 根据 token 获取用户信息
 */
async function getUserByToken(token) {
	if (!token) return null
	const db = uniCloud.database()
	const res = await db.collection('users')
		.where({
			token: token,
			tokenExpire: db.command.gt(Date.now())
		})
		.limit(1)
		.get()

	if (res.data && res.data.length > 0) {
		return res.data[0]
	}
	return null
}

/**
 * 格式化用户信息（去掉敏感字段）
 */
function formatUserInfo(user) {
	if (!user) return null
	const {
		_id,
		openid,
		unionid,
		token,
		tokenExpire,
		sessionKey,
		...safeUser
	} = user
	return safeUser
}

module.exports = {
	success,
	error,
	createToken,
	getTokenExpire,
	httpsGet,
	getWxSession,
	decryptWxData,
	getUserByToken,
	formatUserInfo
}
