import React from "react";
import classNames from "classnames";
import "./SubtitleListItem.scss";
import TimeFormat from "hh-mm-ss";
import ReactSVG from "react-svg";
import favoriteIcon from "../../assets/icons/favorite.svg";
import otherIcon from "../../assets/icons/other.svg";
import SubtitleOtherSettings from "../SubtitleOtherSittings";
import ModalBackdrop from "../ModalBackdrop";
import checkedIcon from "../../assets/icons/checked.svg";
import videoAction from '../../services/videoAction'
import {inject,observer} from 'mobx-react'
import { observable, action } from "mobx";

@inject("subtitles")
@observer
class SubtitleListItem extends React.Component {
	@observable openOtherSettings = false
  @action toggleOpenOtherSetting = e => {
		this.openOtherSettings = !this.openOtherSettings
  };
  componentDidMount() {
    this.props.measure();
    this.updateMeasure = () => {
      this.props.measure();
    };
    window.addEventListener("resize", this.updateMeasure);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateMeasure);
  }
  @action handleSetOtherFunc = (id,func) => {
    this.props.subtitles.handleSetOtherFuncItem(id,func);
    setTimeout(_ => {
			this.openOtherSettings = false
    }, 400);
  };
  onClickChildren(e, event,id) {
    e.stopPropagation();
    event(id);
	}
	clickOnItem = startTime => {
    videoAction.setTime(startTime);
	};
  render() {
		const subState = this.props.subtitles;
    const curSubtitleOption = subState.subtitlesOption[this.props.info.id] || {};
    const isCurrent =
      subState.videoTime >= this.props.info.startTime &&
      subState.videoTime < this.props.info.endTime;
    const itemClass = classNames("SubtitleListItem", {
      current: isCurrent,
      checked: curSubtitleOption.checked
    });
    const otherClass = classNames("other", {
      active: this.openOtherSettings
    });
    const checkboxClass = classNames("checkbox", {
      checked: curSubtitleOption.checked
    });
    const favoriteClass = classNames("favorite", {
      active: curSubtitleOption.favorite
    });
    return (
      <div
        style={this.props.style}
        className={itemClass}
        onClick={_=>this.clickOnItem(this.props.info.startTime)}
      >
        <div className="flex-start">
          <div className="time">
            {TimeFormat.fromMs(Math.floor(this.props.info.startTime / 1000) * 1000)}
          </div>
          <div
            onClick={e => this.onClickChildren(e, subState.handleCheckItem,this.props.info.id)}
            className={checkboxClass}
          >
            <ReactSVG src={checkedIcon} className="svg" />
          </div>
          <div className="text">{this.props.info.text}</div>
        </div>
        <div className="flex-end">
          <div
            className={favoriteClass}
            onClick={e => this.onClickChildren(e, subState.handleFavItem,this.props.info.id)}
          >
            <ReactSVG src={favoriteIcon} className="svg" />
          </div>
          <div className="other-menu-wrapper">
            <div
              className={otherClass}
              onClick={e =>
                this.onClickChildren(e, this.toggleOpenOtherSetting,this.props.info.id)
              }
            >
              <ReactSVG src={otherIcon} className="svg" />
            </div>
            {this.openOtherSettings && (
              <SubtitleOtherSettings
                activeFunc={curSubtitleOption.otherFunc}
                handleChangeFunc={func=>this.handleSetOtherFunc(this.props.info.id, func)}
              />
            )}
          </div>
        </div>
        {this.openOtherSettings && (
          <ModalBackdrop onClose={e=>this.onClickChildren(e,this.toggleOpenOtherSetting)} />
        )}
      </div>
    );
  }
}
export default SubtitleListItem;
