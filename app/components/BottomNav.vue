<template>
  <nav class="bottom-nav" role="navigation" aria-label="底部导航">
    <div class="bottom-nav__surface">
      <NuxtLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="bottom-nav__item"
        :class="{ 'bottom-nav__item--active': isActive(item.path) }"
        :aria-label="item.label"
        :aria-current="isActive(item.path) ? 'page' : undefined"
      >
        <span class="bottom-nav__indicator" aria-hidden="true"></span>
        <span class="bottom-nav__icon" aria-hidden="true">
          <svg v-if="item.name === 'home'" viewBox="0 0 24 24" fill="none">
            <path d="M3.75 10.75L12 4l8.25 6.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.75 10.5v8.25c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25V10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 20v-5.25c0-.41.34-.75.75-.75h3.5c.41 0 .75.34.75.75V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="item.name === 'task'" viewBox="0 0 24 24" fill="none">
            <path d="M8 6.5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 11.5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 16.5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4.5 6.5l.75.75L6.75 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.5 11.5l.75.75 1.5-1.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.5 16.5l.75.75 1.5-1.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none">
            <path d="M12 12.5c2.35 0 4.25-1.9 4.25-4.25S14.35 4 12 4 7.75 5.9 7.75 8.25s1.9 4.25 4.25 4.25z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.75 20c.85-3.2 3.65-5.25 7.25-5.25S18.4 16.8 19.25 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="bottom-nav__label">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const route = useRoute()

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const navItems = [
  { name: 'home',    label: $lang('首页'),    path: '/' },
  // { name: 'finance', label: $lang('理财'),    path: '/finance' },
  // { name: 'team',    label: $lang('团队'),    path: '/team' },
  { name: 'task',    label: $lang('任务'),    path: '/task' },
  { name: 'profile', label: $lang('个人中心'), path: '/profile' },
]
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as *;

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(100vw, rem(375));
  height: calc(rem(68) + env(safe-area-inset-bottom, 0px));
  background: $color-white;
  border-top: 1px solid rgba(230, 230, 230, 0.9);
  box-shadow: 0 -8px 24px rgba(31, 31, 31, 0.08);
  z-index: 50;
  box-sizing: border-box;
  padding: rem(6) rem(10) calc(rem(6) + env(safe-area-inset-bottom, 0px));

  &__surface {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: rem(6);
  }

  &__item {
    min-width: 0;
    min-height: rem(52);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: rem(3);
    cursor: pointer;
    color: $color-gray-500;
    border-radius: rem(12);
    transition: color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;

    &--active {
      color: $color-primary;
      background: $color-primary-bg;

      .bottom-nav__icon {
        color: $color-primary;
      }

      .bottom-nav__indicator {
        opacity: 1;
        transform: translateX(-50%) scaleX(1);
      }
    }

    &:focus-visible {
      outline: rem(2) solid rgba(206, 0, 0, 0.35);
      outline-offset: rem(2);
    }

    &:active {
      transform: scale(0.96);
    }
  }

  &__indicator {
    position: absolute;
    top: rem(5);
    left: 50%;
    width: rem(18);
    height: rem(3);
    background: $color-primary;
    border-radius: $radius-full;
    opacity: 0;
    transform: translateX(-50%) scaleX(0.45);
    transition: opacity 0.18s ease, transform 0.18s ease;
  }

  &__icon {
    width: rem(28);
    height: rem(24);
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    transition: color 0.18s ease;

    svg {
      width: rem(22);
      height: rem(22);
      display: block;
    }
  }

  &__label {
    max-width: 100%;
    font-size: rem(11);
    line-height: 1.15;
    font-weight: 600;
    white-space: nowrap;
    letter-spacing: 0;
    overflow: hidden;
    text-overflow: ellipsis;

    .bottom-nav__item--active & {
      font-weight: 700;
      color: $color-primary;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .bottom-nav {
    &__item,
    &__indicator,
    &__icon {
      transition: none;
    }
  }
}
</style>
