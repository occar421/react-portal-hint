import { addDecorator, configure } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

// automatically import all files ending in /stories/*.tsx etc.
const req = require.context("../stories", true, /\.[jt]sx?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withInfo());

configure(loadStories, module);
