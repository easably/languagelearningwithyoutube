import React from "react";
import classNames from "classnames";
import "./SubtitleListItem.scss";
import TimeFormat from "hh-mm-ss";
import ReactSVG from "react-svg";
import favoriteIcon from "../../assets/icons/favorite.svg";
import otherIcon from "../../assets/icons/other.svg";
import SubtitleOtherSettings from '../SubtitleOtherSittings'
import ModalBackdrop from '../ModalBackdrop'

export default class SubtitleListItem extends React.Component {
  constructor(props) {
		super(props);
		this.state={
			openOtherSettings: false
		}
	}
	toggleOpenOtherSetting=e=>{
		e.stopPropagation();
		this.setState(state=>{
			return {
				openOtherSettings: !state.openOtherSettings
			}
		})
	}
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
  render() {
    const itemClass = classNames("SubtitleListItem", {
      current: this.props.isCurrent
		});
		const otherClass = classNames('other','svg',{
			active: this.state.openOtherSettings
		})
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
          <div className="checkbox"></div>
          <div className="text">{this.props.text}</div>
        </div>
        <div className="flex-end">
          <ReactSVG src={favoriteIcon} className="favorite svg" />
					<div className="other-menu-wrapper">
          	<ReactSVG src={otherIcon} className={otherClass} onClick={this.toggleOpenOtherSetting}/>
						{this.state.openOtherSettings && <SubtitleOtherSettings/>}
					</div>
        </div>
				{this.state.openOtherSettings && <ModalBackdrop onClose={this.toggleOpenOtherSetting}/>}
      </div>
    );
  }
}
