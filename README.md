# Glide

A lightweight, robust, and performant smooth scroll library. Built for modern browsers and designed to be simple to use and easy to integrate into any project.

<br/>

- [Features](#features)
- [Packages](#packages)
- [Installation](#installation)
- [Setup](#setup)
- [No-code usage](#no-code-usage)
- [Settings](#settings)
- [Properties](#properties)
- [Methods](#methods)
- [Events](#events)
- [Considerations](#considerations)
- [Limitations](#limitations)
- [Troubleshooting](#troubleshooting)
- [License](#license)

<br/>

## Features

- **Lightweight & dependency-free** — the whole library is a few KB with zero runtime dependencies
- **Runs on native scroll** — wraps the browser's own scroll, so position: sticky, anchor links, and accessibility keep working
- **Any axis** — smooth vertical, horizontal, and nested scrolling from a single instance
- **Built for sync** — drives WebGL scroll scenes, GSAP ScrollTrigger, and parallax off one loop
- **Framework adapters** — first-class packages for React, Vue, and Framer
- **Scroll snapping** — the snap plugin aligns sections without fighting the smooth scroll

## Packages

- `glide` — core library
- `glide/react` — React adapter
- `glide/vue` — Vue adapter
- `glide/snap` — scroll-snap plugin

<br/>

## Installation

Using a package manager:

```bash
npm i glide
# or
yarn add glide
# or
pnpm add glide
```

```js
import Glide from 'glide'
```

<br/>

Using scripts:

```html
<script src="https://unpkg.com/glide@1.3.26/dist/glide.min.js"></script>
```


<br/>

## Setup

### Basic:

```js
// Initialize Glide
const glide = new Glide({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
glide.on('scroll', (e) => {
  console.log(e);
});
```

### Custom raf loop:

```js
// Initialize Glide
const glide = new Glide();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  glide.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

### Recommended CSS:

**Import stylesheet:**
```js
import 'glide/dist/glide.css'
```

**Or link the CSS file:**

```html
<link rel="stylesheet" href="https://unpkg.com/glide@1.3.26/dist/glide.css">
```

**Or add it manually:**

[See glide.css stylesheet](./packages/core/glide.css)

### GSAP ScrollTrigger:
```js
// Initialize a new Glide instance for smooth scrolling
const glide = new Glide();

// Synchronize Glide scrolling with GSAP's ScrollTrigger plugin
glide.on('scroll', ScrollTrigger.update);

// Add Glide's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Glide's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  glide.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

```

<br/>

## No-code usage

One line, no build step — just drop this into your HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/glide@1.3.26/dist/glide.css">
<script src="https://unpkg.com/glide@1.3.26/dist/glide.min.js"></script>
<script>new Glide({ autoRaf: true, autoToggle: true, anchors: true, allowNestedScroll: true, naiveDimensions: true, stopInertiaOnNavigate: true })</script>
```

That's it, your page now has smooth scrolling and should handle most of the usual issues such as:
- compatibility with other packages
- modals
- smooth anchors
- scroll reset on page change

<br/>


## Settings

| Option                  | Type                       | Default                                            | Description                                                                                                                                                                                                                                                                          |
|-------------------------|----------------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `allowNestedScroll`     | `boolean`                  | `false`                                            | Automatically allow nested scrollable elements to scroll natively. This is the simplest way to handle nested scroll. ⚠️ Can create performance issues since it checks the DOM tree on every scroll event. If that's a concern, use `prevent` option instead.          |
| `anchors`               | `boolean, ScrollToOptions` | `false`                                            | Scroll to anchor links when clicked. If `true` is passed, it will enable anchor links with default options. If `ScrollToOptions` is passed, it will enable anchor links with the given options.                                                                                      |
| `autoRaf`               | `boolean`                  | `false`                                            | Whether or not to automatically run `requestAnimationFrame` loop.                                                                                                                                                                                                                    |
| `autoResize`            | `boolean`                  | `true`                                             | Resize instance automatically based on `ResizeObserver`. If `false` you must resize manually using `.resize()`.                                                                                                                                                                      |
| `autoToggle`            | `boolean`                  | `false`                                            | Automatically start or stop the glide instance based on the wrapper's overflow property, ⚠️ this requires Glide recommended CSS. Safari > 17.3, Chrome > 116 and Firefox > 128 ([https://caniuse.com/?search=transition-behavior](https://caniuse.com/?search=transition-behavior)). |
| `content`               | `HTMLElement`              | `document.documentElement`                         | The element that contains the content that will be scrolled, usually `wrapper`'s direct child.                                                                                                                                                                                       |
| `duration`              | `number`                   | `1.2`                                              | The duration of scroll animation (in seconds). Useless if lerp defined.                                                                                                                                                                                                              |
| `easing`                | `function`                 | `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` | The easing function to use for the scroll animation, our default is custom but you can pick one from [Easings.net](https://easings.net/en). Useless if lerp defined.                                                                                                                 |
| `eventsTarget`          | `HTMLElement, Window`      | `wrapper`                                          | The element that will listen to `wheel` and `touch` events.                                                                                                                                                                                                                          |
| `gestureOrientation`    | `string`                   | `vertical`                                         | The orientation of the gestures. Can be `vertical`, `horizontal` or `both`.                                                                                                                                                                                                          |
| `infinite`              | `boolean`                  | `false`                                            | Enable infinite scrolling! `syncTouch: true` is required on touch devices.                                                                                                                                                                                                           |
| `lerp`                  | `number`                   | `0.1`                                              | Linear interpolation (lerp) intensity (between 0 and 1).                                                                                                                                                                                                                             |
| `naiveDimensions`       | `boolean`                  | `false`                                            | If `true`, Glide will use naive dimensions calculation. ⚠️ Be careful, this has a performance impact.                                                                                                                                                                                |
| `orientation`           | `string`                   | `vertical`                                         | The orientation of the scrolling. Can be `vertical` or `horizontal`.                                                                                                                                                                                                                 |
| `overscroll`            | `boolean`                  | `true`                                             | Similar to CSS overscroll-behavior (https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior).                                                                                                                                                                           |
| `prevent`               | `function`                 | `undefined`                                        | Manually prevent scroll to be smoothed based on elements traversed by events. If `true` is returned, it will prevent the scroll to be smoothed. Example: `(node) =>  node.classList.contains('cookie-modal')`.                                                                       |
| `respectReducedMotion`  | `boolean`                  | `true`                                             | Honor the user's `prefers-reduced-motion` setting: smoothing is disabled and programmatic scrolls are instant, while scroll keeps running on the main thread.                                                                                                                         |
| `smoothWheel`           | `boolean`                  | `true`                                             | Smooth the scroll initiated by `wheel` events.                                                                                                                                                                                                                                       |
| `stopInertiaOnNavigate` | `boolean`                  | `false`                                            | If `true`, Glide will stop inertia when an internal link is clicked.                                                                                                                                                                                                                 |
| `syncTouch`             | `boolean`                  | `false`                                            | Mimic touch device scroll while allowing scroll sync (can be unstable on iOS<16).                                                                                                                                                                                                    |
| `syncTouchLerp`         | `number`                   | `0.075`                                            | Lerp applied during `syncTouch` inertia.                                                                                                                                                                                                                                             |
| `touchInertiaExponent`  | `number`                   | `1.7`                                              | Manage the strength of syncTouch inertia.                                                                                                                                                                                                                                            |
| `touchMultiplier`       | `number`                   | `1`                                                | The multiplier to use for touch events.                                                                                                                                                                                                                                              |
| `virtualScroll`         | `function`                 | `undefined`                                        | Manually modify the events before they get consumed. If `false` is returned, the scroll will not be smoothed. Examples: `(e) => { e.deltaY /= 2 }` (to slow down vertical scroll) or `({ event }) => !event.shiftKey` (to prevent scroll to be smoothed if shift key is pressed).    |
| `wheelMultiplier`       | `number`                   | `1`                                                | The multiplier to use for mouse wheel events.                                                                                                                                                                                                                                        |
| `wrapper`               | `HTMLElement, Window`      | `window`                                           | The element that will be used as the scroll container.                                                                                                                                                                                                                               |
<br/>


## Properties

| Property                | Type              | Description                                                                |
|-------------------------|-------------------|----------------------------------------------------------------------------|
| `actualScroll`          | `number`          | Current scroll value registered by the browser                             |
| `animatedScroll`        | `number`          | Current scroll value                                                       |
| `className` (getter)    | `string`          | `rootElement` className                                                    |
| `dimensions`            | `object`          | Dimensions instance                                                        |
| `direction`             | `number`          | `1`: scrolling up, `-1`: scrolling down                                    |
| `isHorizontal` (getter) | `boolean`         | Whether or not the instance is horizontal                                  |
| `isScrolling` (getter)  | `boolean, string` | Whether or not the scroll is being animated, `smooth`, `native` or `false` |
| `isStopped` (getter)    | `boolean`         | Whether or not the user should be able to scroll                           |
| `lastVelocity`          | `number`          | Last scroll velocity                                                       |
| `limit` (getter)        | `number`          | Maximum scroll value                                                       |
| `options`               | `object`          | Instance options                                                           |
| `prefersReducedMotion` (getter) | `boolean` | Whether the user prefers reduced motion and Glide is honoring it           |
| `progress` (getter)     | `number`          | Scroll progress from `0` to `1`                                            |
| `rootElement` (getter)  | `HTMLElement`     | Element on which Glide is instanced                                        |
| `scroll` (getter)       | `number`          | Current scroll value (handles infinite scroll if activated)                |
| `targetScroll`          | `number`          | Target scroll value                                                        |
| `time`                  | `number`          | Time elapsed since instance creation                                       |
| `velocity`              | `number`          | Current scroll velocity                                                    |

<br/>

## Methods

| Method                      | Description                                                                     | Arguments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-----------------------------|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `destroy()`                 | Destroys the instance and removes all events.                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `on(id, function)`          | `id` can be any of the following [instance events](#events) to listen.          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `raf(time)`                 | Must be called every frame for internal usage.                                  | `time`: in ms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `resize()`                  | Compute internal sizes, it has to be used if `autoResize` option is `false`.    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `scrollTo(target, options)` | Scroll to target.                                                               | `target`: goal to reach<ul><li>`number`: value to scroll in pixels</li><li>`string`: CSS selector or keyword (`top`, `left`, `start`, `bottom`, `right`, `end`)</li><li>`HTMLElement`: DOM element</li></ul>`options`<ul><li>`offset`(`number`): equivalent to [`scroll-padding-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-top)</li><li>`lerp`(`number`): animation lerp intensity</li><li>`duration`(`number`): animation duration (in seconds)</li><li>`easing`(`function`): animation easing</li><li>`immediate`(`boolean`): ignore duration, easing and lerp</li><li>`lock`(`boolean`): whether or not to prevent the user from scrolling until the target is reached</li><li>`force`(`boolean`): reach target even if instance is stopped</li><li>`onComplete`(`function`): called when the target is reached</li><li>`userData`(`object`): this object will be forwarded through `scroll` events</li></ul> |
| `start()`                   | Resumes the scroll                                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `stop()`                    | Pauses the scroll                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |



## Events

| Event            | Callback Arguments        |
|------------------|---------------------------|
| `scroll`         | Glide instance            |
| `virtual-scroll` | `{deltaX, deltaY, event}` |


<br/>

## Considerations

### Nested scroll

The simplest and most reliable way to handle nested scrollable elements is to use the `allowNestedScroll` option:

```js
const glide = new Glide({
  allowNestedScroll: true,
})
```

This automatically detects nested scrollable elements and lets them scroll natively. However, this can create performance issues since Glide needs to check the DOM tree on every scroll event. If you experience performance problems, use `data-glide-prevent` instead.

#### Using HTML attributes

```html
<div data-glide-prevent>scrollable content</div>
```

| Attribute                       | Description                          |
|---------------------------------|--------------------------------------|
| `data-glide-prevent`            | Prevent all smooth scroll events     |
| `data-glide-prevent-wheel`      | Prevent wheel events only            |
| `data-glide-prevent-touch`      | Prevent touch events only            |
| `data-glide-prevent-vertical`   | Prevent vertical scroll events only  |
| `data-glide-prevent-horizontal` | Prevent horizontal scroll events only|

#### Using Javascript

```html
<div id="modal">scrollable content</div>
```

```js
const glide = new Glide({
  prevent: (node) => node.id === 'modal',
})
```



### Anchor links
By default, Glide will prevent anchor links from working while scrolling. To enable them, you must set `anchors: true`.

```js
new Glide({
  anchors: true
})
```

You can also use `scrollTo` options:

```js
new Glide({
  anchors: {
    offset: 100,
    onComplete: ()=>{
      console.log('scrolled to anchor')
    }
  }
})
```

### Reduced motion

By default, Glide honors the user's [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) setting: when it is set to `reduce`, smoothing is disabled (`lerp` is forced to `1` so the scroll tracks the input device 1:1, ignoring `duration`/`easing`) and programmatic scrolls (`scrollTo`, anchor links) jump instantly to their target. Glide keeps running so WebGL/DOM synchronization stays intact, and the preference is picked up live without a reload. You can check `glide.prefersReducedMotion` to adapt your own animations.

You can opt out (not recommended) with:

```js
const glide = new Glide({
  respectReducedMotion: false,
})
```

<br/>

## Limitations

- no support for CSS scroll-snap, you must use `glide/snap`
- capped to 60fps on Safari ([source](https://bugs.webkit.org/show_bug.cgi?id=173434)) and 30fps on low power mode
- smooth scroll will stop working over iframe since they don't forward wheel events
- touch events may behave unexpectedly when `syncTouch` is enabled on iOS < 16
- nested scroll containers require proper configuration to work correctly

<br/>

## Troubleshooting
- Make sure you use the latest version of Glide
- Include the recommended CSS
- If using GSAP ScrollTrigger, ensure proper integration (see [GSAP ScrollTrigger setup](#setup) section)
- Test without Glide to ensure your element/page is scrollable
- Be sure to use `autoRaf: true` or manually call `glide.raf(time)` in your animation loop

<br/>

## License

MIT
