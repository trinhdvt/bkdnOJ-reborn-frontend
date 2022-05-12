import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

function PDFViewer({pdf}) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const pdfUrl = (pdf || "http://localhost:8000/problem/problem_pdf/hello/problem.pdf")

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
      <Viewer fileUrl={pdfUrl} />
    </Worker>
  )
}
export default PDFViewer;