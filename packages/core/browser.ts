// This file serves as an entry point for the package
import { Glide } from './src/glide'

// @ts-expect-error
globalThis.Glide = Glide
// @ts-expect-error
globalThis.Glide.prototype = Glide.prototype
