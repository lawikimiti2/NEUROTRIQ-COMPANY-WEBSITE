import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation the way a plain
// multi-page site would, so without this, navigating to a new route keeps
// whatever scroll offset the previous page was left at. Hash links (e.g.
// Contact's #get-in-touch) are left alone — the target page handles those
// itself.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
