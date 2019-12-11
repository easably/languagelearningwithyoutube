import React, { useEffect } from "react";
import classNames from "classnames";
import "./SubtitleListItem.scss";
import TimeFormat from "hh-mm-ss";
import ReactSVG from "react-svg";
import favoriteIcon from "../../assets/icons/favorite.svg";
import otherIcon from "../../assets/icons/other.svg";
import SubtitleOtherSettings from "../SubtitleOtherSittings";
import ModalBackdrop from "../ModalBackdrop";
import checkedIcon from "../../assets/icons/checked.svg";
import videoAction from "../../services/videoAction";
import store from "../../store";
import { useLocalStore, observer } from "mobx-react-lite";

export default observer(props => {
  const state = useLocalStore(() => ({
    openOtherSettings: false,
    toggleOpenOtherSetting() {
      this.openOtherSettings = !this.openOtherSettings;
    }
  }));

  const updateHeightCell = props.measure;
  const text = props.info.text;
  useEffect(() => {
    updateHeightCell();
  }, [text, updateHeightCell]);
  useEffect(() => {
    window.addEventListener("resize", updateHeightCell);
    return () => {
      window.removeEventListener("resize", updateHeightCell);
    };
  }, [updateHeightCell]);

  let handleSetOtherFunc = (id, func) => {
    store.subtitles.handleSetOtherFuncItem(id, func);
    setTimeout(_ => {
      state.toggleOpenOtherSetting();
    }, 400);
  };
  let onClickChildren = (e, event, id) => {
    e.stopPropagation();
    event(id);
  };
  let clickOnItem = startTime => {
    videoAction.setTime(startTime);
  };
  const subState = store.subtitles;
  const curSubtitleOption = subState.subtitlesOption[props.info.id] || {};
  const isCurrent =
    subState.videoTime >= props.info.startTime &&
    subState.videoTime < props.info.endTime;
  const itemClass = classNames("SubtitleListItem", {
    current: isCurrent,
    checked: curSubtitleOption.checked
  });
  const otherClass = classNames("other", {
    active: state.openOtherSettings
  });
  const checkboxClass = classNames("checkbox", {
    checked: curSubtitleOption.checked
  });
  const favoriteClass = classNames("favorite", {
    active: curSubtitleOption.favorite
  });
  return (
    <div
      style={props.style}
      className={itemClass}
      onClick={_ => clickOnItem(props.info.startTime)}
    >
      <div className="flex-start">
        <div className="time">
          {TimeFormat.fromMs(Math.floor(props.info.startTime / 1000) * 1000)}
        </div>
        <div
          onClick={e =>
            onClickChildren(e, subState.handleCheckItem, props.info.id)
          }
          className={checkboxClass}
        >
          <ReactSVG src={checkedIcon} className="svg" />
        </div>
        <div className="text">{props.info.text}</div>
      </div>
      <div className="flex-end">
        <div
          className={favoriteClass}
          onClick={e =>
            onClickChildren(e, subState.handleFavItem, props.info.id)
          }
        >
          <ReactSVG src={favoriteIcon} className="svg" />
        </div>
        <div className="other-menu-wrapper">
          <div
            className={otherClass}
            onClick={e =>
              onClickChildren(e, state.toggleOpenOtherSetting, props.info.id)
            }
          >
            <ReactSVG src={otherIcon} className="svg" />
          </div>
          {state.openOtherSettings && (
            <SubtitleOtherSettings
              activeFunc={curSubtitleOption.otherFunc}
              handleChangeFunc={func => handleSetOtherFunc(props.info.id, func)}
            />
          )}
        </div>
      </div>
      {state.openOtherSettings && (
        <ModalBackdrop
          onClose={e => onClickChildren(e, state.toggleOpenOtherSetting)}
        />
      )}
    </div>
  );
});
