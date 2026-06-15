<template>
	<view class="container">
		<view class="card user-card">
			<image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
			<view class="user-info">
				<text class="name">{{ userInfo.realName || userInfo.nickname || '未设置姓名' }}</text>
				<text class="meta">{{ userInfo.school || '' }} {{ userInfo.studentId || '' }}</text>
				<text class="role-tag" :class="roleClass">{{ roleText }}</text>
			</view>
		</view>

		<view class="card menu-card">
			<view class="menu-item" @click="goTo('/pages/bind-student/bind-student')">
				<text>完善资料</text>
				<text class="arrow">›</text>
			</view>
			<view class="menu-item" @click="goTo('/pages/rider-apply/rider-apply')">
				<text>认证骑手</text>
				<text class="status">{{ riderStatusText }}</text>
			</view>
			<view class="menu-item">
				<text>我的余额</text>
				<text class="text-primary">¥{{ userInfo.balance || 0 }}</text>
			</view>
			<view class="menu-item" @click="handleLogout">
				<text>退出登录</text>
				<text class="arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getUserInfo, logout, setUserInfo } from '@/utils/auth.js'
import { callFunction } from '@/utils/request.js'

export default {
	data() {
		return {
			userInfo: {}
		}
	},
	onShow() {
		this.loadUserInfo()
	},
	computed: {
		roleText() {
			const map = {
				user: '普通用户',
				rider: '认证骑手',
				admin: '管理员'
			}
			return map[this.userInfo.role] || '普通用户'
		},
		roleClass() {
			return {
				'role-user': this.userInfo.role === 'user',
				'role-rider': this.userInfo.role === 'rider',
				'role-admin': this.userInfo.role === 'admin'
			}
		},
		riderStatusText() {
			const map = {
				none: '未认证',
				pending: '审核中',
				approved: '已认证',
				rejected: '审核未通过'
			}
			return map[this.userInfo.riderStatus] || '未认证'
		}
	},
	methods: {
		loadUserInfo() {
			const local = getUserInfo()
			if (local) {
				this.userInfo = local
			}
			// 同时从服务器刷新
			callFunction('getUserInfo').then(res => {
				this.userInfo = res.userInfo
				setUserInfo(res.userInfo)
			}).catch(() => {})
		},
		goTo(url) {
			uni.navigateTo({ url })
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						logout()
						uni.redirectTo({ url: '/pages/login/login' })
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.user-card {
	display: flex;
	align-items: center;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background-color: #e6e6e6;
	margin-right: 24rpx;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.meta {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 12rpx;
}

.role-tag {
	align-self: flex-start;
	font-size: 22rpx;
	padding: 4rpx 16rpx;
	border-radius: 8rpx;
}

.role-user {
	background-color: #e3f2fd;
	color: #2979ff;
}

.role-rider {
	background-color: #e8f5e9;
	color: #18bc37;
}

.role-admin {
	background-color: #fff3e0;
	color: #f0ad4e;
}

.menu-card {
	padding: 0 30rpx;
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100rpx;
	border-bottom: 1rpx solid #f0f0f0;
	font-size: 30rpx;
	color: #333;
}

.menu-item:last-child {
	border-bottom: none;
}

.arrow {
	font-size: 36rpx;
	color: #999;
}

.status {
	font-size: 26rpx;
	color: #999;
}
</style>
