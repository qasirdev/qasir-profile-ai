export const DIGITAL_TWIN_OPEN_EVENT = "digital-twin:open";
export const DIGITAL_TWIN_DISMISSED_KEY = "dt-twin-dismissed";

export function isDigitalTwinDismissed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(DIGITAL_TWIN_DISMISSED_KEY) === "1";
}

export function markDigitalTwinDismissed(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(DIGITAL_TWIN_DISMISSED_KEY, "1");
}

export function shouldAutoOpenDigitalTwin(): boolean {
  return !isDigitalTwinDismissed();
}

export function openDigitalTwin(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(DIGITAL_TWIN_OPEN_EVENT));
}
