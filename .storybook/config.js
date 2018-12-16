import { configure } from "@storybook/react";

// automatically import all files ending in /stories/*.tsx etc.
const req = require.context("../stories", true, /\.[jt]sx?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
