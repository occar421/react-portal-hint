let baseElement: HTMLElement | null = document.querySelector("body");

export function set(element: string | HTMLElement): void {
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
  if (!baseElement) {
    throw new Error("The base element is not set.");
  }
  return baseElement;
}
