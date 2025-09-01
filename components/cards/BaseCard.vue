<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 12 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 0.35 } }"
    class="group relative h-full rounded-2xl border-2 border-gray-500/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 
           backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden
           hover:border-brand-500/80 hover:shadow-brand-500/20 hover:shadow-xl"
  >
    <!-- Efeito de brilho no hover -->
    <div class="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/10 to-brand-500/0 
                opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
    
    <!-- Borda animada -->
    <div class="absolute inset-0 rounded-2xl border-2 border-gray-500/70 group-hover:border-brand-500/80 
                transition-all duration-300 pointer-events-none"></div>
                
    <!-- Efeito de brilho sutil no canto -->
    <div class="absolute -inset-1 bg-gradient-to-br from-brand-500/20 to-transparent rounded-xl 
                opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 pointer-events-none"></div>
    <div class="h-full flex flex-col p-6">
      <slot name="header" />
      <div class="flex-1 flex flex-col justify-between">
        <slot />
      </div>
    </div>
  </div>
</template>
