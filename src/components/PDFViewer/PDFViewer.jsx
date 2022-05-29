import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import './PDFViewer.scss';

function PDFViewer({pdf}) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const pdfUrl = (pdf)

  return (
    <div className="problem-detail-pdf-container">
      {
        pdf ?
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfUrl} defaultScale={SpecialZoomLevel.PageFit}
            plugins={[defaultLayoutPluginInstance]}/>
        </Worker>
        : <h4>PDF Not Available</h4>
      }
    </div>
  )
}
export default PDFViewer;