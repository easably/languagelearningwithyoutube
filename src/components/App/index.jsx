import React, { useEffect } from "react";
import isElectron from "is-electron";
import SideTranscription from "../SideTranscription";
import "./App.scss";

export default () => {
  useEffect(() => {
    if (isElectron()) {
      let messageListener = e => {
        if (e.origin !== window.location.origin) return;
        const message = e.data;
        if (message.type === "videoAction") {
          window.ipcRenderer.send("videoAction", message.data);
        }
      };
      window.ipcRenderer.on("changePage", _ => {
        window.postMessage({ type: "changePage" }, window.location.origin);
      });
      window.ipcRenderer.on("subtitles", (e, subtitles) => {
        window.postMessage(
          { type: "subtitles", data: subtitles },
          window.location.origin
        );
      });
      window.ipcRenderer.on("videoEvents", (e, data) => {
        window.postMessage(
          { type: "videoEvents", data },
          window.location.origin
        );
      });
      window.addEventListener("message", messageListener, false);
      return () => {
        window.removeEventListener("message", messageListener, false);
      };
    }
  }, []);
  return (
    <div className="App">
      <SideTranscription />
    </div>
  );
};
