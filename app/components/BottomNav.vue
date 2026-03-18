<template>
  <nav class="bottom-nav" role="navigation" aria-label="底部导航">
    <NuxtLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.path"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': isActive(item.path) }"
      :aria-label="item.label"
    >
      <span class="bottom-nav__icon" aria-hidden="true">
        <!-- 首页 — 网格风格 -->
        <svg v-if="item.name === 'home'" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
        </svg>
        <!-- 理财 — 趋势图 -->
        <svg v-else-if="item.name === 'finance'" viewBox="0 0 24 24" fill="none">
          <path d="M3 17l4.5-5 4 3.5L16 9l5 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 20h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="21" cy="13" r="1.5" fill="currentColor"/>
        </svg>
        <!-- 团队 — 节点网络 -->
        <svg v-else-if="item.name === 'team'" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="2.5" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="5" cy="17" r="2.5" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="19" cy="17" r="2.5" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 7.5v3M12 10.5l-5.5 4.5M12 10.5l5.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <!-- 任务 — 进度条风格 -->
        <svg v-else-if="item.name === 'task'" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
          <rect x="3" y="4" width="13" height="2.5" rx="1.25" fill="currentColor"/>
          <rect x="3" y="10.75" width="18" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
          <rect x="3" y="10.75" width="8" height="2.5" rx="1.25" fill="currentColor"/>
          <rect x="3" y="17.5" width="18" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
          <rect x="3" y="17.5" width="16" height="2.5" rx="1.25" fill="currentColor"/>
        </svg>
        <!-- 个人中心 — 六边形头像 -->
        <svg v-else viewBox="0 0 24 24" fill="none">
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      </span>
      <span class="bottom-nav__label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const navItems = [
  { name: 'home',    label: '首页',    path: '/' },
  { name: 'finance', label: '理财',    path: '/finance' },
  { name: 'team',    label: '团队',    path: '/team' },
  { name: 'task',    label: '任务',    path: '/task' },
  { name: 'profile', label: '个人中心', path: '/profile' },
]
</script>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: rem(375);
  height: rem(64);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: stretch;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0);

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: rem(4);
    cursor: pointer;
    color: #94A3B8;
    transition: $transition-fast;
    min-height: rem(44);
    text-decoration: none;
    position: relative;

    &--active {
      color: #2563EB;

      // 顶部指示线
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: rem(24);
        height: 2px;
        background: #2563EB;
        border-radius: 0 0 rem(2) rem(2);
      }

      .bottom-nav__icon {
        background: rgba(37, 99, 235, 0.08);
        border-radius: rem(8);
      }
    }

    &:active {
      opacity: 0.6;
    }
  }

  &__icon {
    width: rem(32);
    height: rem(28);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition-fast;

    svg {
      width: rem(20);
      height: rem(20);
    }
  }

  &__label {
    font-size: rem(10);
    line-height: 1;
    font-weight: 500;
    white-space: nowrap;
    letter-spacing: 0.2px;

    .bottom-nav__item--active & {
      font-weight: 700;
      color: #2563EB;
    }
  }
}
</style>
