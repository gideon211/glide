# glide/vue

## Introduction
glide/vue provides a `<VueGlide>` component that creates a Glide instance and provides it to its children via context. This allows you to use Glide in your Vue app without worrying about passing the instance down through props. It also provides a `useGlide` hook that allows you to access the Glide instance from any component in your app. glide/vue provides a vueGlidePlugin that you can use to register the component globally. This allows you to use the component in your templates without having to import it, by using the `vue-glide` template tag.


## Installation

```bash
npm i glide
```

### Vue
```js
// main.js
import { createApp } from 'vue'
import GlideVue from 'glide/vue'

const app = createApp({})

app.use(GlideVue)
```

### Nuxt

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['glide/nuxt'],
})
```

## Recommended CSS

Import the Glide CSS to ensure proper behavior:

```js
import 'glide/dist/glide.css'
```

## Usage

```vue
<script setup>
import { VueGlide, useGlide } from 'glide/vue' // Also available as global imports, no need to import them manually
import { watch } from 'vue'

const glideOptions = {
  // glide options (optional)
}

const glide = useGlide((glide) => {
  // called every scroll
  console.log(glide)
})

watch(
  glide,
  (glide) => {
    // glide instance
    console.log(glide)
  },
  { immediate: true }
)
</script>

<template>
  <VueGlide root :options="glideOptions" />
  <!-- content -->
</template>
```

## Props
- `options`: Glide options.
- `root`: if `true`, Glide will be instanciate using `<html>` scroll, then you can use the `useGlide` hook to access the Glide instance from anywhere in your app. Default: `false`.

## Hooks
Once the Glide context is set (components mounted inside `<VueGlide>` or `<vue-glide>`) you can use these handy hooks:

`useGlide` is a hook that returns the Glide instance

The hook takes two arguments:
- `callback`: The function to be called whenever a scroll event is emitted
- `priority`: Manage callback execution order

```vue
<script setup>
import { VueGlide, useGlide } from 'glide/vue'
import { watch } from 'vue'

const scrollCallback = (glide) => {
  // called on every scroll
  // useGlide provides the glide instance as an argument
}

const glide = useGlide(scrollCallback, 0) // where 0 is the default callback priority
</script>

<template>
  <VueGlide root />
  <!-- content -->
</template>
```





## Examples

### GSAP integration

```vue
<script setup>
import { ref, watchEffect } from 'vue'
import { VueGlide, useGlide } from 'glide/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const glideRef = ref()

watchEffect((onInvalidate) => {
   if (!glideRef.value?.glide) return

  //  if using GSAP ScrollTrigger, update ScrollTrigger on scroll
  glideRef.value.glide.on('scroll', ScrollTrigger.update)

  // add the Glide requestAnimationFrame (raf) method to GSAP's ticker
  // this ensures Glide's smooth scroll animation updates on each GSAP tick
  function update(time) {
    glideRef.value.glide.raf(time * 1000)
  }
  gsap.ticker.add(update)

  // disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0)

  // clean up GSAP's ticker from the previous execution of watchEffect, or when the effect is stopped
  onInvalidate(() => {
    gsap.ticker.remove(update)
  })
})

// if using GSAP ScrollTrigger, remember to register the plugin
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
})
</script>

<template>
  <VueGlide root ref="glideRef" :options="{ autoRaf: false }" />
  <!-- content -->
</template>
```

### Motion Integration
```vue
<script setup>
import { VueGlide } from 'glide/vue'
import { cancelFrame, frame } from 'motion-v'
import { onMounted, onUnmounted, ref } from 'vue'

const glideRef = ref()

function update({ timestamp }) {
  glideRef.value?.glide?.raf(timestamp)
}

onMounted(() => {
  frame.update(update, true)
})

onUnmounted(() => {
  cancelFrame(update)
})
</script>

<template>
  <VueGlide ref="glideRef" root :options="{ autoRaf: false }">
  <!-- content -->
</template>
```

<br/>

## License

MIT
