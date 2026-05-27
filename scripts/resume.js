(() => {
  const pdfUrl = "../assets/Isaiah-Hardy-Resume.pdf";
  const workerUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const fallbackMessage =
    '<p class="pdf-status">Could not load the PDF. <a href="../assets/Isaiah-Hardy-Resume.pdf">Open or download it here</a>.</p>';
  const viewer = document.getElementById("pdf-viewer");

  if (!viewer || typeof window.pdfjsLib === "undefined") return;

  window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  function createCanvas(viewport) {
    const canvas = document.createElement("canvas");
    canvas.className = "pdf-page";
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    return canvas;
  }

  async function renderPage(pdf, pageNum) {
    const page = await pdf.getPage(pageNum);
    const containerWidth = viewer.clientWidth || 800;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport);
    const context = canvas.getContext("2d");

    viewer.appendChild(canvas);
    await page.render({ canvasContext: context, viewport }).promise;
  }

  async function renderResume() {
    const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
    viewer.innerHTML = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      await renderPage(pdf, pageNum);
    }
  }

  renderResume().catch(() => {
    viewer.innerHTML = fallbackMessage;
  });
})();
