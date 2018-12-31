let baseElement: HTMLElement = document.querySelector("body");

export function set(element: string | HTMLElement) {
  if (typeof element === "string") {
    const el = document.querySelectorAll(element);
    baseElement = ("length" in el ? el[0] : el) as HTMLElement;
  } else if (element instanceof HTMLElement) {
    baseElement = element;
  } else {
    throw Error("Invalid base element");
  }
}

export function get(): HTMLElement {
  return baseElement;
}
