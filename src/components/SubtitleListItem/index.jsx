import React from "react";
import classNames from "classnames";
import "./SubtitleListItem.scss";
import TimeFormat from "hh-mm-ss";
import ReactSVG from "react-svg";
import favoriteIcon from "../../assets/icons/favorite.svg";
import otherIcon from "../../assets/icons/other.svg";
export default class SubtitleListItem extends React.Component {
    componentDidMount(){
        this.props.measure()
        this.updateMeasure = ()=>{
            this.props.measure()
        }
        window.addEventListener('resize',this.updateMeasure)
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.updateMeasure)
    }
    render() {
        const itemClass = classNames("SubtitleListItem", {
            current: this.props.isCurrent
        });
        return (
            <div style={this.props.style} className={itemClass} onClick={this.props.handleClick}>
                <div className="flex-start">
                    <div className="time">
                        {TimeFormat.fromMs(
                            Math.floor(this.props.startTime / 1000) * 1000
                        )}
                    </div>
                    <div className="checkbox"></div>
                    <div className="text">{this.props.text}</div>
                </div>
                <div className="flex-end">
                    <ReactSVG src={favoriteIcon} className="favorite svg" />
                    <ReactSVG src={otherIcon} className="other svg" />
                </div>
            </div>
        );
    }
}
