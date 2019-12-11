import React from "react";
import "./SubtitleList.scss";
import SubtitleListItem from "../SubtitleListItem";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import { observer, inject } from "mobx-react";

@inject("subtitles")
@observer
class SubtitleList extends React.Component {
  constructor(props) {
    super(props);
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 53,
      minHeight: 53
    });
    this.listRef = React.createRef();
  }

  filterText(subtitles, text) {
    return subtitles.filter(
      s => s.text.toUpperCase().indexOf(text.toUpperCase()) !== -1
    );
  }

  filterFavorite(subtitles, option) {
    let favKeys = Object.keys(option).filter(i => {
      return option[i].favorite;
    });
    return subtitles.filter(sub => favKeys.some(key => key === sub.id));
  }

  rowRenderer = ({ index, key, parent, style }, subtitles) => {
    let subtitle = subtitles[index];
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
            info={subtitle}
            key={key}
          />
        )}
      </CellMeasurer>
    );
  };
  render() {
    const subState = this.props.subtitles;
		let subtitles = subState.selectLangSubtitles;
		if (!subtitles) return null;
    if (subState.favoriteFilter)
      subtitles = this.filterFavorite(subtitles, subState.subtitlesOption);
    if (subState.searchText)
			subtitles = this.filterText(subtitles, subState.searchText);
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="SubtitleList scroll"
              ref={this.listRef}
              width={width}
              height={height}
              rowCount={subtitles.length}
              rowHeight={this.cache.rowHeight}
              rowRenderer={params => this.rowRenderer(params, subtitles)}
              style={{ outline: "none" }}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
export default SubtitleList;
