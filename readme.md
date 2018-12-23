# react-portal-hint

This library is experimental phase. Everything is subject to change.

Tooltip/Popover which exploits React Portals. Parallel fading is enabled.

## TODO

- [ ] Support more place option (top, bottom, left, right, corners, and combinations of these)
- [ ] Make portal root element configurable
- [ ] Follow target or hint content size or position (Use ResizeObserver?)
- [ ] Well-documented documents

## How to use

### Use this as tooltip with default style

```jsx
import Hint from "react-portal-hint";
import "react-portal-hint/default.css";

<Hint content="Hello!">
  <button>Something happens...</button>
</Hint>;
```
