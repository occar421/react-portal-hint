# react-portal-hint

This library is experimental phase. Everything is subject to change.

Tooltip/Popover which exploits React Portals. Parallel fading is enabled.  
[Demo](https://react-portal-hint-demo.netlify.com/)

[![CircleCI](https://circleci.com/gh/occar421/react-portal-hint.svg?style=svg)](https://circleci.com/gh/occar421/react-portal-hint)
[![npm version](https://img.shields.io/npm/v/react-portal-hint.svg)](https://www.npmjs.com/package/react-portal-hint)
[![license](https://img.shields.io/github/license/occar421/react-portal-hint.svg)](https://choosealicense.com/licenses/)

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
