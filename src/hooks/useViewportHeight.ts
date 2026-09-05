import { useEffect } from 'react';

/**
 * Keeps the `--app-height` custom property in sync with the visual viewport.
 *
 * Mobile browsers shrink the *visual* viewport when the on-screen keyboard
 * opens, but leave the *layout* viewport - and therefore `100dvh` - untouched.
 * The shell then overflows the screen and the browser scrolls the document to
 * reveal the focused input, which drags the header out of view. Sizing the
 * shell to `visualViewport.height`, and pinning the document to the top, keeps
 * the header in place while the keyboard is open.
 */
export function useViewportHeight() {
  useEffect(() => {
    const viewport = window.visualViewport;
    const root = document.documentElement;

    const apply = () => {
      const height = viewport?.height ?? window.innerHeight;
      root.style.setProperty('--app-height', `${Math.round(height)}px`);

      // Undo any document scroll the browser applied to reveal the input.
      // Skipped while pinch-zoomed so we don't fight the user.
      const zoomed = (viewport?.scale ?? 1) > 1.01;
      if (!zoomed && window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    apply();

    viewport?.addEventListener('resize', apply);
    viewport?.addEventListener('scroll', apply);
    window.addEventListener('orientationchange', apply);

    return () => {
      viewport?.removeEventListener('resize', apply);
      viewport?.removeEventListener('scroll', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--app-height');
    };
  }, []);
}
