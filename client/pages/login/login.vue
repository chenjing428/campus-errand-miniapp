<template>
	<view class="container login-page">
		<view class="logo-section">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="title">校园跑腿</text>
			<text class="subtitle">快递 · 外卖 · 文件代取</text>
		</view>

		<view class="login-section">
			<button
				class="btn-primary"
				open-type="getPhoneNumber"
				@getphonenumber="handleGetPhoneNumber"
				:loading="loading"
			>
				微信一键登录
			</button>
			<text class="agreement">登录即表示同意《用户协议》和《隐私政策》</text>
		</view>
	</view>
</template>

<script>
import { callFunction, showError } from '@/utils/request.js'
import { setToken, setUserInfo } from '@/utils/auth.js'

export default {
	data() {
		return {
			loading: false
		}
	},
	methods: {
		async handleGetPhoneNumber(e) {
			if (e.detail.errMsg !== 'getPhoneNumber:ok') {
				uni.showToast({ title: '需要手机号授权才能登录', icon: 'none' })
				return
			}

			this.loading = true
			try {
				// 1. 获取微信登录 code
				const [loginErr, loginRes] = await uni.login({ provider: 'weixin' })
				if (loginErr) throw loginErr

				// 2. 调用云函数登录
				const result = await callFunction('login', {
					code: loginRes.code,
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				})

				setToken(result.token)
				setUserInfo(result.userInfo)

				// 3. 根据用户信息决定跳转
				this.redirectAfterLogin(result.userInfo)
			} catch (err) {
				showError(err)
			} finally {
				this.loading = false
			}
		},

		redirectAfterLogin(userInfo) {
			if (!userInfo.phone) {
				uni.redirectTo({ url: '/pages/bind-phone/bind-phone' })
				return
			}
			if (!userInfo.studentId) {
				uni.redirectTo({ url: '/pages/bind-student/bind-student' })
				return
			}
			uni.switchTab({ url: '/pages/profile/profile' })
		}
	}
}
</script>

<style lang="scss" scoped>
.login-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	padding-top: 160rpx;
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 120rpx;
}

.logo {
	width: 180rpx;
	height: 180rpx;
	background-color: #e6e6e6;
	border-radius: 32rpx;
	margin-bottom: 30rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #999;
}

.login-section {
	width: 100%;
	padding: 0 60rpx;
}

.agreement {
	display: block;
	text-align: center;
	font-size: 24rpx;
	color: #999;
	margin-top: 30rpx;
}
</style>
