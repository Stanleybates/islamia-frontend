import { useEffect } from "react";
import logo from "@/assets/logo.png";

const COVER_ID = "ami-privacy-cover";
const ON_CLASS = "ami-cover-on";

// Hides the portal behind a plain logo screen the moment the app is left,
// so the phone's recent-apps preview does not show student information.
// Best effort: the phone decides when it takes the preview picture.
export default function usePrivacyCover(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const style = document.createElement("style");
    style.textContent =
      "#" + COVER_ID + "{position:fixed;inset:0;z-index:2147483647;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#fff;color:#19574d;text-align:center;padding:24px}" +
      "html." + ON_CLASS + " #" + COVER_ID + "{display:flex}";

    const cover = document.createElement("div");
    cover.id = COVER_ID;
    cover.innerHTML =
      '<img src="' + logo + '" alt="" style="width:96px;height:96px;object-fit:contain">' +
      '<div style="font-weight:600">Allahul Musta\'an Institute</div>' +
      '<div style="font-size:13px;opacity:.7">Tap to continue</div>';

    document.head.appendChild(style);
    document.body.appendChild(cover);

    const root = document.documentElement;
    const show = () => root.classList.add(ON_CLASS);
    const hide = () => root.classList.remove(ON_CLASS);
    const onBlur = () => {
      // Opening a payment window (an iframe) also blurs the page: do not cover that.
      if (document.activeElement instanceof HTMLIFrameElement) return;
      show();
    };
    const onVisibility = () => (document.visibilityState === "hidden" ? show() : hide());

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", hide);
    window.addEventListener("pagehide", show);
    window.addEventListener("pageshow", hide);
    document.addEventListener("visibilitychange", onVisibility);
    cover.addEventListener("pointerdown", hide); // safety: a tap always removes the cover

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", hide);
      window.removeEventListener("pagehide", show);
      window.removeEventListener("pageshow", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      hide();
      cover.remove();
      style.remove();
    };
  }, [active]);
}
