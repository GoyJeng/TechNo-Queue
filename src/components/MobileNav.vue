<template>
  <nav
    class="
      fixed
      bottom-0
      left-0
      right-0
      z-30
      flex
      h-16
      items-center
      justify-around
      border-t
      border-zinc-800
      bg-zinc-950/95
      backdrop-blur
      lg:hidden
    "
  >

    <RouterLink
      to="/today"
      class="mobile-item"
      active-class="mobile-active"
    >
      <span class="text-lg">
        ◷
      </span>

      <span>
        Today
      </span>
    </RouterLink>

    <RouterLink
      to="/calendar"
      class="mobile-item"
      active-class="mobile-active"
    >
      <span class="text-lg">
        ▦
      </span>

      <span>
        Calendar
      </span>
    </RouterLink>

    <RouterLink
      to="/dashboard"
      class="mobile-item"
      active-class="mobile-active"
    >
      <span class="text-lg">
        ▥
      </span>

      <span>
        Dashboard
      </span>
    </RouterLink>

  </nav>
</template>

<style scoped>
.mobile-item {
  display: flex;
  min-width: 70px;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.7rem;
  color: rgb(113 113 122);
}

.mobile-active {
  color: rgb(167 139 250);
}
</style>