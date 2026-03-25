<template>
    <div class="email-detail-page">
        <div class="email-detail">
            <div class="detail-header">
                <h1 class="detail-title">{{ currentEmail?.title }}</h1>
                <div class="detail-meta">
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6"/>
                            <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ currentEmail?.time }}</span>
                    </div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>系统通知</span>
                    </div>
                </div>
            </div>

            <div class="detail-divider"></div>

            <div class="detail-content">
                <template v-if="currentEmail">
                    <p v-for="(paragraph, index) in currentEmail.content.split('\n')" :key="index" class="content-paragraph">
                        {{ paragraph }}
                    </p>
                </template>
                <div v-else class="empty-detail">
                    <span>邮件不存在</span>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <!-- <div class="detail-actions">
            <button class="action-btn action-btn--reply">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polyline points="9,17 4,12 9,7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>回复</span>
            </button>
            <button class="action-btn action-btn--delete">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>删除</span>
            </button>
        </div> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from '#imports'

definePageMeta({ layout: 'second-page' })

const route = useRoute()
const currentEmail = ref(null)

const allEmails = [
    {
        id: '1',
        title: '账户安全提醒',
        preview: '您的账户刚刚在新设备上登录，如非本人操作，请及时修改密码...',
        time: '2024-01-15 10:30',
        isRead: false,
        content: '尊敬的用户：\n\n您的账户刚刚在新设备上登录。\n\n登录信息：\n- 时间：2024-01-15 10:30\n- 设备：iPhone 15 Pro\n- 地点：São Paulo, Brazil\n\n如非本人操作，请立即通过"忘记密码"功能修改密码，或联系客服。\n\n为保护您的账户安全，建议您开启两步验证。\n\n此致\n安全团队'
    },
    {
        id: '2',
        title: '新功能上线通知',
        preview: '我们推出了全新的VIP会员体系，享受更多专属权益...',
        time: '2024-01-14 昨天',
        isRead: false,
        content: '亲爱的用户：\n\n我们很高兴地通知您，全新VIP会员体系正式上线！\n\n新功能亮点：\n1. 专属客服通道\n2. 优先处理权益\n3. 专属优惠券\n4. 生日礼包\n\n立即升级VIP，享受更多专属权益！\n\n此致\n产品团队'
    },
    {
        id: '3',
        title: '订单确认',
        preview: '您的订单 #ORD20240115001 已确认，预计3天内送达...',
        time: '2024-01-14 昨天',
        isRead: false,
        content: '尊敬的用户：\n\n您的订单已确认成功！\n\n订单信息：\n- 订单号：#ORD20240115001\n- 商品：Premium会员套餐（年卡）\n- 金额：R$ 599.00\n- 预计送达：3个工作日内\n\n感谢您的购买！\n\n此致\n运营团队'
    },
    {
        id: '4',
        title: '欢迎注册',
        preview: '感谢您注册我们的服务，您可以通过以下方式开始使用...',
        time: '2024-01-10 1月10日',
        isRead: true,
        content: '欢迎加入！\n\n感谢您注册我们的服务。\n\n开始使用：\n1. 完善个人资料\n2. 探索产品功能\n3. 参与新手任务\n\n如有任何问题，请联系客服。\n\n此致\n团队'
    },
    {
        id: '5',
        title: '活动通知',
        preview: '新春特惠活动火热进行中，错过等一年！',
        time: '2024-01-05 1月5日',
        isRead: true,
        content: '🎉 新春特惠活动火热进行中！\n\n活动内容：\n- 全场8折\n- 满减优惠\n- 限时礼品\n\n活动时间：1月1日 - 1月31日\n\n不要错过！\n\n此致\n市场团队'
    }
]

onMounted(() => {
    const emailId = route.query.id
    currentEmail.value = allEmails.find(e => e.id === emailId)
})
</script>

<style scoped lang="scss">
.email-detail-page {
    min-height: 100vh;
    background: $color-bg-page;
    display: flex;
    flex-direction: column;
    padding-top: rem(10);
}

.email-detail {
    flex: 1;
    background: #fff;
    margin: rem(12) rem(16);
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
    overflow: hidden;
}

.detail-header {
    padding: rem(20) rem(16) rem(16);
}

.detail-title {
    font-size: rem(18);
    font-weight: 600;
    color: $color-text-primary;
    line-height: 1.4;
    margin-bottom: rem(12);
}

.detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: rem(16);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: rem(6);
    font-size: rem(13);
    color: $color-text-muted;

    svg {
        width: rem(14);
        height: rem(14);
    }
}

.detail-divider {
    height: 1px;
    background: #E2E8F0;
    margin: 0 rem(16);
}

.detail-content {
    padding: rem(16);
}

.content-paragraph {
    font-size: rem(14);
    color: $color-text-primary;
    line-height: 1.8;
    margin-bottom: rem(12);
    white-space: pre-wrap;

    &:last-child {
        margin-bottom: 0;
    }
}

.empty-detail {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(40);
    color: $color-text-muted;
    font-size: rem(14);
}

// ── Action Buttons ─────────────────────────────────────────────────
.detail-actions {
    display: flex;
    gap: rem(12);
    padding: rem(16);
    background: #fff;
    border-top: 1px solid #E2E8F0;
}

.action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(8);
    padding: rem(12) rem(16);
    border: none;
    border-radius: $radius-lg;
    font-size: rem(14);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    svg {
        width: rem(18);
        height: rem(18);
    }

    &:active {
        transform: scale(0.98);
    }

    &--reply {
        background: $color-primary;
        color: #fff;
    }

    &--delete {
        background: #FEE2E2;
        color: $color-danger;
    }
}
</style>
