<template>
    <div class="email-page">
        <!-- Tabs -->
        <div class="tabs">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                class="tab-btn"
                :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key"
            >
                {{ tab.label }}
                <span class="tab-count">{{ getTabCount(tab.key) }}</span>
            </button>
        </div>

        <!-- Email List -->
        <div class="email-list">
            <div
                v-for="email in filteredEmails"
                :key="email.id"
                class="email-item"
                :class="{ unread: !email.isRead }"
                @click="goToDetail(email)"
            >
                <div class="email-icon" :class="{ unread: !email.isRead }">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="email-content">
                    <div class="email-header">
                        <div class="email-title">{{ email.title }}</div>
                        <div class="email-time">{{ email.time }}</div>
                    </div>
                    <div class="email-preview">{{ email.preview }}</div>
                </div>
                <div v-if="!email.isRead" class="unread-dot"></div>
            </div>

            <div v-if="filteredEmails.length === 0" class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>暂无{{ activeTab === 'unread' ? '未读' : '已读' }}邮件</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from '#imports'

definePageMeta({ layout: 'second-page' })

const router = useRouter()
const activeTab = ref('unread')

const tabs = [
    { key: 'unread', label: '未读' },
    { key: 'read', label: '已读' }
]

const unreadEmails = ref([
    {
        id: '1',
        title: '账户安全提醒',
        preview: '您的账户刚刚在新设备上登录，如非本人操作，请及时修改密码...',
        time: '10:30',
        isRead: false,
        content: '尊敬的用户：\n\n您的账户刚刚在新设备上登录。\n\n登录信息：\n- 时间：2024-01-15 10:30\n- 设备：iPhone 15 Pro\n- 地点：São Paulo, Brazil\n\n如非本人操作，请立即通过"忘记密码"功能修改密码，或联系客服。\n\n为保护您的账户安全，建议您开启两步验证。\n\n此致\n安全团队'
    },
    {
        id: '2',
        title: '新功能上线通知',
        preview: '我们推出了全新的VIP会员体系，享受更多专属权益...',
        time: '昨天',
        isRead: false,
        content: '亲爱的用户：\n\n我们很高兴地通知您，全新VIP会员体系正式上线！\n\n新功能亮点：\n1. 专属客服通道\n2. 优先处理权益\n3. 专属优惠券\n4. 生日礼包\n\n立即升级VIP，享受更多专属权益！\n\n此致\n产品团队'
    },
    {
        id: '3',
        title: '订单确认',
        preview: '您的订单 #ORD20240115001 已确认，预计3天内送达...',
        time: '昨天',
        isRead: false,
        content: '尊敬的用户：\n\n您的订单已确认成功！\n\n订单信息：\n- 订单号：#ORD20240115001\n- 商品：Premium会员套餐（年卡）\n- 金额：R$ 599.00\n- 预计送达：3个工作日内\n\n感谢您的购买！\n\n此致\n运营团队'
    }
])

const readEmails = ref([
    {
        id: '4',
        title: '欢迎注册',
        preview: '感谢您注册我们的服务，您可以通过以下方式开始使用...',
        time: '1月10日',
        isRead: true,
        content: '欢迎加入！\n\n感谢您注册我们的服务。\n\n开始使用：\n1. 完善个人资料\n2. 探索产品功能\n3. 参与新手任务\n\n如有任何问题，请联系客服。\n\n此致\n团队'
    },
    {
        id: '5',
        title: '活动通知',
        preview: '新春特惠活动火热进行中，错过等一年！',
        time: '1月5日',
        isRead: true,
        content: '🎉 新春特惠活动火热进行中！\n\n活动内容：\n- 全场8折\n- 满减优惠\n- 限时礼品\n\n活动时间：1月1日 - 1月31日\n\n不要错过！\n\n此致\n市场团队'
    }
])

const getTabCount = (key) => {
    return key === 'unread' ? unreadEmails.value.length : readEmails.value.length
}

const filteredEmails = computed(() => {
    return activeTab.value === 'unread' ? unreadEmails.value : readEmails.value
})

const goToDetail = (email) => {
    router.push({
        path: '/profile/email/details',
        query: { id: email.id }
    })
}
</script>

<style scoped lang="scss">
.email-page {
    min-height: 100vh;
    background: $color-bg-page;
}

// ── Tabs ───────────────────────────────────────────────────────────
.tabs {
    display: flex;
    margin: rem(20) rem(14) rem(10);
    background: #FFFFFF;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    padding: rem(4);
    gap: rem(4);
    box-shadow: $shadow-xs;
}

.tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(5);
    height: rem(38);
    border-radius: $radius-md;
    font-size: rem(13);
    font-weight: 600;
    color: $color-text-muted;
    cursor: pointer;
    transition: $transition-fast;

    &.active {
        background: $gradient-primary;
        color: #fff;
        box-shadow: $shadow-blue;
    }

    &:not(.active):active {
        background: $color-bg-hover;
    }
}

.tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: rem(18);
    height: rem(18);
    padding: 0 rem(5);
    border-radius: $radius-full;
    font-size: rem(10);
    font-weight: 700;
    background: rgba(255, 255, 255, 0.25);
    color: inherit;

    .tab-btn:not(.active) & {
        background: $color-primary-bg;
        color: $color-primary;
    }
}

// ── Email List ─────────────────────────────────────────────────────
.email-list {
    padding: rem(10) rem(14);
}

.email-item {
    display: flex;
    align-items: flex-start;
    gap: rem(12);
    padding: rem(16);
    background: #fff;
    border-radius: $radius-lg;
    margin-bottom: rem(10);
    box-shadow: $shadow-sm;
    cursor: pointer;
    transition: transform 0.2s;
    position: relative;

    &:active {
        transform: scale(0.98);
    }

    &.unread {
        background: #F8FAFF;
    }
}

.email-icon {
    width: rem(40);
    height: rem(40);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #E2E8F0;
    border-radius: $radius-full;
    flex-shrink: 0;

    svg {
        width: rem(20);
        height: rem(20);
        color: $color-text-secondary;
    }

    &.unread {
        background: linear-gradient(135deg, $color-primary, #6366F1);

        svg {
            color: #fff;
        }
    }
}

.email-content {
    flex: 1;
    min-width: 0;
}

.email-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: rem(4);
}

.email-title {
    font-size: rem(15);
    font-weight: 600;
    color: $color-text-primary;
    @include text-ellipsis;
}

.email-time {
    font-size: rem(12);
    color: $color-text-muted;
    flex-shrink: 0;
    margin-left: rem(8);
}

.email-preview {
    font-size: rem(13);
    color: $color-text-secondary;
    @include text-ellipsis(2);
    line-height: 1.5;
}

.unread-dot {
    width: rem(8);
    height: rem(8);
    background: $color-primary;
    border-radius: 50%;
    position: absolute;
    right: rem(16);
    top: 50%;
    transform: translateY(-50%);
}

// ── Empty State ────────────────────────────────────────────────────
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: rem(60) rem(20);
    color: $color-text-muted;

    svg {
        width: rem(48);
        height: rem(48);
        margin-bottom: rem(12);
        opacity: 0.5;
    }

    span {
        font-size: rem(14);
    }
}
</style>
