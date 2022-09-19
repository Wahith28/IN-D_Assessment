import "./styles.css";

import { Viewer } from "@react-pdf-viewer/core"; // install this library
// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"; // install this library
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// Worker
import { Worker } from "@react-pdf-viewer/core"; // install this library
import { searchPlugin } from "@react-pdf-viewer/search";
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import { RenderHighlightsProps } from "@react-pdf-viewer/highlight";
import { useEffect, useState } from "react";
import file from "./254_page_26_Contract-Breach.pdf";
import data from "./data.json";

export default function App() {
  var areas = [];
  const getArea = (val) => {
    console.log("test", val);
    areas.push({
      left: 55,
      top: 20.0772,
      pageIndex: val.position.pageNumber - 1,
      height: val.position.boundingRect[0].height / 300,
      width: val.position.boundingRect[0].width / 50
      // left: val.position.boundingRect[0].x1,
      // top: val.position.boundingRect[0].y1
    });
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {areas
        .filter((area) => area.pageIndex === props.pageIndex)
        .map((area, idx) => (
          <div
            key={idx}
            className="highlight-area"
            style={Object.assign(
              {},
              {
                background: "yellow",
                opacity: 0.4
              },
              // Calculate the position
              // to make the highlight area displayed at the desired position
              // when users zoom or rotate the document
              props.getCssProperties(area, props.rotation)
            )}
          />
        ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
    trigger: Trigger.toggle
  });
  const [key, setKey] = useState("");
  const searchPluginInstance = searchPlugin({ keyword: [key] });
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [viewPdf, setViewPdf] = useState(file);

  const handleClick = (val) => {
    setKey(val.value);
    getArea(val);
    console.log(key);
  };

  useEffect(() => {
    setViewPdf(file);
  }, [key]);

  return (
    <div className="App">
      <div className="a">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "lightblue"
          }}
        >
          <p>Contract-Breach</p>
          <p>Similarity Score: NA</p>
        </div>
        {data.response.values.map((item, index) => {
          return (
            <div key={index} style={{ width: "100%" }}>
              <button className="btn" onClick={() => handleClick(item)}>
                <span>
                  {index + 1}. <b>{item.value}</b>
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="b">
        <div
          style={{
            width: "100%",
            backgroundColor: "lightblue",
            height: "9vh"
          }}
        ></div>

        {/* show pdf conditionally (if we have one)  */}
        <div style={{ height: "91vh", overflowY: "auto" }}>
          {viewPdf && (
            <>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={viewPdf}
                  plugins={[
                    defaultLayoutPluginInstance,
                    searchPluginInstance,
                    highlightPluginInstance
                  ]}
                />
              </Worker>
            </>
          )}

          {/* if we dont have pdf or viewPdf state is null */}
          {!viewPdf && <>No pdf file selected</>}
        </div>
      </div>
    </div>
  );
}
