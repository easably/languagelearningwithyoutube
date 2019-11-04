import React from "react";
import "./SubtitleList.scss";
import videoEvents from "../../services/videoEvents";

export default class SubtitleList extends React.Component {
    render() {
        const subtitles = this.props.subtitles;
        let content;
        if (subtitles) {
            content = this.props.subtitles.map((e, index) => {
                return (
                    <li
                        className={
                            this.props.videoTime >= e.startTime &&
                            this.props.videoTime < e.endTime
                                ? "current"
                                : ""
                        }
                        key={index}
                        onClick={_ => videoEvents.setTime(e.startTime)}
                    >
                        {e.text}
                    </li>
                );
            });
        } else {
            content = this.props.text;
        }
        return (
            <div className="SubtitleList">
                <div className="content">
                    {this.props.loading ? "loading..." : content}
                </div>
            </div>
        );
    }
}
