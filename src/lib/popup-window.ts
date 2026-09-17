const POPUP_WIDTH = 1280;
const POPUP_HEIGHT = 800;

export function openPopupWindow(url: string, windowName: string) {
  const left = Math.max(0, Math.round((window.screen.width - POPUP_WIDTH) / 2));
  const top = Math.max(0, Math.round((window.screen.height - POPUP_HEIGHT) / 2));

  window.open(
    url,
    windowName,
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},noopener,noreferrer`,
  );
}
