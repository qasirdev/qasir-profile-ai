export const DIGITAL_TWIN_OPEN_EVENT = "digital-twin:open";

export function openDigitalTwin(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(DIGITAL_TWIN_OPEN_EVENT));
}
