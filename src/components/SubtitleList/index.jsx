import React from "react";
import "./SubtitleList.scss";
import videoEvents from "../../services/videoEvents";
import SubtitleListItem from "../SubtitleListItem";

export default class SubtitleList extends React.Component {
    render() {
        let list = this.props.subtitles.map((e, index) => {
            return (
                <SubtitleListItem
                    isCurrent={
                        this.props.videoTime >= e.startTime &&
                        this.props.videoTime < e.endTime
                    }
                    text={e.text}
                    handleClick={_ => {console.log(e.startTime); videoEvents.setTime(e.startTime)}}
                    startTime={e.startTime}
                    key={index}
                />
            );
        });

        return <div className="SubtitleList scroll">{list}</div>;
    }
}
