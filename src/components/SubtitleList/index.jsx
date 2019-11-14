import React from "react";
import "./SubtitleList.scss";
import videoEvents from "../../services/videoEvents";
import SubtitleListItem from "../SubtitleListItem";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";

export default class SubtitleList extends React.Component {
  constructor(props) {
    super(props);
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight :53,
      minHeight:53
    });
    this.listRef = React.createRef();
  }
  rowRenderer = ({ index, isScrolling, key, parent, style }) => {
    let e = this.props.subtitles[index];
    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <SubtitleListItem
            measure={measure}
            style={style}
            isCurrent={
              this.props.videoTime >= e.startTime &&
              this.props.videoTime < e.endTime
            }
            text={e.text}
            handleClick={_ => {
              videoEvents.setTime(e.startTime);
            }}
            startTime={e.startTime}
            key={key}
          />
        )}
      </CellMeasurer>
    );
  };
  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="SubtitleList scroll"
              ref={this.listRef}
              width={width}
              height={height}
              rowCount={this.props.subtitles.length}
              rowHeight={this.cache.rowHeight}
              rowRenderer={this.rowRenderer}
              style={{ outline: "none" }}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
