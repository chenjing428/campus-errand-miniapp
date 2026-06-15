<script>
export default {
	onLaunch() {
		console.log('App Launch')
	},
	onShow() {
		console.log('App Show')
	},
	onHide() {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
/* 全局基础样式 */
page {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	background-color: #f5f5f5;
}

.container {
	padding: 30rpx;
}

.card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.btn-primary {
	background-color: #2979FF;
	color: #fff;
	border-radius: 12rpx;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 32rpx;
	text-align: center;
	border: none;
}

.btn-primary::after {
	border: none;
}

.btn-primary[disabled] {
	background-color: #a0c4ff;
}

.text-primary {
	color: #2979FF;
}

.text-muted {
	color: #999;
}
</style>
