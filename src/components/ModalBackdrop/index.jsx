import React from "react";
import "./ModalBackdrop.scss";

export default function ModalBackdrop(props) {
  return <div className="ModalBackdrop" onClick={props.onClose}></div>;
}
