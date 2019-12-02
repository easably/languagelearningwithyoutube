import React from "react";
import ReactSVG from "react-svg";
import classNames from 'classnames'
import "./SubtitleOtherSettings.scss";
import otherPlayIcon from "../../assets/icons/other_play.svg";
import otherReloadIcon from "../../assets/icons/other_reload.svg";
import otherSpeedIcon from "../../assets/icons/other_speed.svg";

export default function SubtitleOtherSettings() {
	const [activeBtn, setActiveBtn] = React.useState(undefined);

  const onClkBtn = btnName => {
		setActiveBtn(btnName)
	}

	const getClasses = btnName =>{
		return classNames('svg','btn',{
			active: btnName === activeBtn
		})
	}
  return (
    <div className="SubtitleOtherSettings">
      <ReactSVG
        src={otherPlayIcon}
        className={getClasses('play')}
        onClick={_ => onClkBtn("play")}
      />
      <ReactSVG
        src={otherReloadIcon}
        className={getClasses('reload')}
        onClick={_ => onClkBtn("reload")}
      />
      <ReactSVG
        src={otherSpeedIcon}
        className={getClasses('speed')}
        onClick={_ => onClkBtn("speed")}
      />
    </div>
  );
}
