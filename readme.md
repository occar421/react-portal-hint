# react-portal-hint

This library is in the demonstration phase. Everything is subject to change.

Tooltip/Popover which exploits React Portals. Parallel fading is enabled.  
[Demo](https://react-portal-hint-demo.netlify.com/)

[![CircleCI](https://circleci.com/gh/occar421/react-portal-hint.svg?style=svg)](https://circleci.com/gh/occar421/react-portal-hint)
[![npm version](https://img.shields.io/npm/v/react-portal-hint.svg)](https://www.npmjs.com/package/react-portal-hint)
[![license](https://img.shields.io/github/license/occar421/react-portal-hint.svg)](https://choosealicense.com/licenses/)

## TODO

- [x] Implement default style
- [x] Implement port for user-defined style
- [x] Support place options (top, button, left, right)
- [x] Chore (rollup 1.0, use node-sass watch)
- [x] Make portal root element configurable
- [x] Follow target or hint content size or position (Use `ResizeObserver`)
- [x] Support more events
- [x] Support more place options (combinations)
- [x] Implement `transform` observation (Use `setInterval`)
- [x] Resolve margin problem
- [x] Resolve CSS Flexbox & Grid problem
- [x] Add integration tests
- [ ] Add E2E test
- [ ] Examples (Flexbox, CSS grid)
- [ ] Accepts forwardRef
- [ ] Accepts multiple children
- [ ] Accepts Refs as props (exotic)
- [ ] Well-documented documents
- [ ] Purge `getBoundingClientRect` for the performance
- [ ] Multi-browser support

## How to use

### Use this as tooltip with default style

```jsx
import Hint from "react-portal-hint";
import "react-portal-hint/default.css";

<Hint content="Hello!">
  <button>Something happens...</button>
</Hint>;
```

## Props

TODO

## License

MIT
