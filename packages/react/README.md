# glide/react

## Introduction
glide/react provides a `<ReactGlide>` component that creates a Glide instance and provides it to its children via context. This allows you to use Glide in your React app without worrying about passing the instance down through props. It also provides a `useGlide` hook that allows you to access the Glide instance from any component in your app.


## Installation

```bash
npm i glide
```

## Recommended CSS

Import the Glide CSS to ensure proper behavior:

```js
import 'glide/dist/glide.css'
```

## Usage

### Basic

```jsx
import { ReactGlide, useGlide } from 'glide/react'

function App() {
  const glide = useGlide((glide) => {
    // called every scroll
    console.log(glide)
  })

  return (
    <>
      <ReactGlide root />
      { /* content */ }
    </>
  )
}
```

## Props
- `options`: Glide options.
- `root`: When `true`, makes the Glide instance globally accessible via `useGlide` from anywhere in your app (even outside the provider tree). Glide will use the default `<html>` scroll container. When `'asChild'`, renders wrapper elements for custom scroll containers while still making the instance globally accessible. Default: `false`.

## Hooks
Once the Glide context is set (components mounted inside `<ReactGlide>`) you can use these handy hooks:

`useGlide` is a hook that returns the Glide instance

The hook takes three arguments:
- `callback`: The function to be called whenever a scroll event is emitted
- `deps`: Trigger callback on change
- `priority`: Manage callback execution order





## Examples

### Custom requestAnimationFrame loop:

```jsx
import { ReactGlide } from 'glide/react'
import { useEffect, useRef } from 'react'

function App() {
  const glideRef = useRef()
  
  useEffect(() => {
    function update(time) {
      glideRef.current?.glide?.raf(time)
    }
  
    const rafId = requestAnimationFrame(update)
  
    return () => cancelAnimationFrame(rafId)
  }, [])
  
  return (
    <ReactGlide root options={{ autoRaf: false }} ref={glideRef} />
  )
}
```


### GSAP integration

```jsx
import gsap from 'gsap'
import { ReactGlide } from 'glide/react'
import { useEffect, useRef } from 'react'

function App() {
  const glideRef = useRef()
  
  useEffect(() => {
    function update(time) {
      glideRef.current?.glide?.raf(time * 1000)
    }
  
    gsap.ticker.add(update)
  
    return () => gsap.ticker.remove(update)
  }, [])
  
  return (
    <ReactGlide root options={{ autoRaf: false }} ref={glideRef} />
  )
}
```

### Framer Motion integration:
```jsx
import { ReactGlide } from 'glide/react';
import type { GlideRef } from 'glide/react';
import { cancelFrame, frame } from 'framer-motion';
import { useEffect, useRef } from 'react';

function App() {
  const glideRef = useRef<GlideRef>(null)

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp
      glideRef.current?.glide?.raf(time)
    }

    frame.update(update, true)

    return () => cancelFrame(update)
  }, [])


  return (
    <ReactGlide root options={{ autoRaf: false }} ref={glideRef} />
  )
}
```

## glide/react in use


<br/>

## License

MIT
