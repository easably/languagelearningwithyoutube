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

export default class SubtitleListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openOtherSettings: false
    };
  }
  toggleOpenOtherSetting = e => {
    this.setState(state => {
      return {
        openOtherSettings: !state.openOtherSettings
      };
    });
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
  handleSetOtherFunc = func => {
    this.props.handleSetOtherFunc(func);
    setTimeout(_ => {
      this.setState({
        openOtherSettings: false
      });
    }, 400);
  };
  onClickChildren(e, event) {
		e.stopPropagation();
    event();
  }
  render() {
    const itemClass = classNames("SubtitleListItem", {
      current: this.props.isCurrent,
      checked: this.props.isChecked
    });
    const otherClass = classNames("other", {
      active: this.state.openOtherSettings
    });
    const checkboxClass = classNames("checkbox", {
      checked: this.props.isChecked
    });
    const favoriteClass = classNames("favorite", {
      active: this.props.isFavorite
    });
    return (
      <div
        style={this.props.style}
        className={itemClass}
        onClick={this.props.handleClick}
      >
        <div className="flex-start">
          <div className="time">
            {TimeFormat.fromMs(Math.floor(this.props.startTime / 1000) * 1000)}
          </div>
          <div
            onClick={e => this.onClickChildren(e, this.props.handleCheck)}
            className={checkboxClass}
          >
            <ReactSVG src={checkedIcon} className="svg" />
          </div>
          <div className="text">{this.props.text}</div>
        </div>
        <div className="flex-end">
          <div className={favoriteClass} onClick={e=>this.onClickChildren(e, this.props.handleFavorite)}>
            <ReactSVG src={favoriteIcon} className="svg" />
          </div>
          <div className="other-menu-wrapper">
            <div className={otherClass} onClick={e=>this.onClickChildren(e, this.toggleOpenOtherSetting)}>
              <ReactSVG src={otherIcon} className="svg" />
            </div>
            {this.state.openOtherSettings && (
              <SubtitleOtherSettings
                activeFunc={this.props.activeOtherFunc}
                handleChangeFunc={this.handleSetOtherFunc}
              />
            )}
          </div>
        </div>
        {this.state.openOtherSettings && (
          <ModalBackdrop onClose={this.toggleOpenOtherSetting} />
        )}
      </div>
    );
  }
}
