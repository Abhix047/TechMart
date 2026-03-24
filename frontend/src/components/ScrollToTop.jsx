import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
      return undefined;
    }

    const id = hash.replace("#", "");
    let attempts = 0;
    const maxAttempts = 20;

    const scrollToHashTarget = () => {
      const element = document.getElementById(id);
      if (!element) {
        attempts += 1;
        if (attempts < maxAttempts) {
          window.setTimeout(scrollToHashTarget, 100);
        }
        return;
      }

      const offset = window.innerWidth < 1024 ? 84 : 112;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    scrollToHashTarget();
    return undefined;
  }, [pathname, hash]);

  return null;
}
