(() => {
  const modalTriggers = document.querySelectorAll("[data-modal-target]");
  const projectModals = document.querySelectorAll(".project-modal");

  function setDeadwoodOrientation(modal, selectedThumb) {
    if (!modal || modal.id !== "deadwood-modal") return;
    const isPortrait = selectedThumb?.dataset.previewSrc?.includes("deadwood-text") ?? false;
    modal.classList.toggle("project-modal--portrait", isPortrait);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setDeadwoodOrientation(modal, modal.querySelector(".project-thumb.active"));
    modal.querySelector(".modal-close")?.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    if (document.querySelector('.project-modal[aria-hidden="false"]')) return;
    document.body.classList.remove("modal-open");
  }

  function closeOpenModals() {
    projectModals.forEach((modal) => {
      if (modal.getAttribute("aria-hidden") === "false") {
        closeModal(modal);
      }
    });
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(document.getElementById(trigger.dataset.modalTarget));
    });
  });

  projectModals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.classList.contains("modal-close")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOpenModals();
    }
  });

  document.querySelectorAll("[data-preview-target]").forEach((thumb) => {
    thumb.addEventListener("click", (event) => {
      event.stopPropagation();
      const preview = document.getElementById(thumb.dataset.previewTarget);
      if (!preview) return;

      preview.src = thumb.dataset.previewSrc;
      preview.alt = thumb.dataset.previewAlt;

      const modal = thumb.closest(".project-modal");
      if (modal) {
        setDeadwoodOrientation(modal, thumb);
      }

      thumb.parentElement.querySelectorAll(".project-thumb").forEach((button) => {
        button.classList.toggle("active", button === thumb);
      });
    });
  });
})();
