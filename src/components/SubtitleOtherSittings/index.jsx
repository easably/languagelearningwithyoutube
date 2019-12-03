import React from "react";
import ReactSVG from "react-svg";
import classNames from "classnames";
import "./SubtitleOtherSettings.scss";
import otherPlayIcon from "../../assets/icons/other_play.svg";
import otherReloadIcon from "../../assets/icons/other_reload.svg";
import otherSpeedIcon from "../../assets/icons/other_speed.svg";

export default function SubtitleOtherSettings(props) {
  const onClkBtn = (e,btnName) => {
		e.stopPropagation();
    props.handleChangeFunc(btnName);
  };

  const getClasses = btnName => {
    return classNames("btn", {
      active: btnName === props.activeFunc
    });
  };
  return (
    <div className="SubtitleOtherSettings">
      <div className={getClasses("play")} onClick={e => onClkBtn(e,"play")}>
        <ReactSVG src={otherPlayIcon} className="svg" />
      </div>
      <div className={getClasses("reload")} onClick={e => onClkBtn(e,"reload")}>
        <ReactSVG src={otherReloadIcon} className="svg" />
      </div>
      <div className={getClasses("speed")} onClick={e => onClkBtn(e,"speed")}>
        <ReactSVG src={otherSpeedIcon} className="svg" />
      </div>
    </div>
  );
}
