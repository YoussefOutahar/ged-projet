import dynamic from "next/dynamic";

const DWT = dynamic(() => import("app/component/dwt/DynamsoftSDK"), {
  ssr: false,
});

const Scanner = () => (
  <div className="App">
    <DWT
      features={[
        "scan",
        "camera",
        "load",
        "save",
        "upload",
        "barcode",
        "ocr",
        "uploader",
      ]}
    />
  </div>
);

export default Scanner;
