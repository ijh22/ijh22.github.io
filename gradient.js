(() => {
  const pagePositions = {
    home: { x: 88, y: 0 },
    skills: { x: 14, y: 82 },
    projects: { x: 78, y: 42 },
  };

  const durationMs = 650;

  function getPage() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("skills")) {
      return "skills";
    }

    if (path.includes("projects")) {
      return "projects";
    }

    return "home";
  }

  function setGradientPosition(x, y) {
    const root = document.documentElement;
    root.style.setProperty("--gradient-x", `${x}%`);
    root.style.setProperty("--gradient-y", `${y}%`);
    root.style.setProperty("--gradient-x2", `${100 - x}%`);
    root.style.setProperty("--gradient-y2", `${100 - y}%`);
  }

  function easeOut(t) {
    return t * (2 - t);
  }

  const target = pagePositions[getPage()];
  const stored = sessionStorage.getItem("gradientPos");
  const previous = stored ? JSON.parse(stored) : target;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  setGradientPosition(previous.x, previous.y);

  if (
    prefersReducedMotion ||
    (previous.x === target.x && previous.y === target.y)
  ) {
    setGradientPosition(target.x, target.y);
    sessionStorage.setItem("gradientPos", JSON.stringify(target));
    return;
  }

  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / durationMs, 1);
    const eased = easeOut(progress);
    const x = previous.x + (target.x - previous.x) * eased;
    const y = previous.y + (target.y - previous.y) * eased;

    setGradientPosition(x, y);

    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }

    sessionStorage.setItem("gradientPos", JSON.stringify(target));
  }

  requestAnimationFrame(frame);
})();
