import { useEffect } from "react";

// Sets a page-specific browser tab title. This also helps Chrome's address
// bar autocomplete suggest the right page from history - Chrome matches
// against page titles, so every page needs its own distinct one instead of
// sharing one generic site-wide title.
export default function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
