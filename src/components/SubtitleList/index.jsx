import React from "react";
import "./SubtitleList.scss";
import SubtitleListItem from "../SubtitleListItem";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import { observer } from "mobx-react-lite";
import store from "../../store";

export default observer(() => {
  let cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 53,
    minHeight: 53
  });
  const listRef = React.createRef();

  let filterText = (subtitles, text) => {
    return subtitles.filter(
      s => s.text.toUpperCase().indexOf(text.toUpperCase()) !== -1
    );
  };

  let filterFavorite = (subtitles, option) => {
    let favKeys = Object.keys(option).filter(i => {
      return option[i].favorite;
    });
    return subtitles.filter(sub => favKeys.some(key => key === sub.id));
  };

  let rowRenderer = ({ index, key, parent, style }, subtitles) => {
    let subtitle = subtitles[index];
    return (
      <CellMeasurer
        cache={cache}
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
  const subState = store.subtitles;
  let subtitles = subState.selectLangSubtitles;
  if (!subtitles) return null;
  if (subState.favoriteFilter)
    subtitles = filterFavorite(subtitles, subState.subtitlesOption);
  if (subState.searchText)
    subtitles = filterText(subtitles, subState.searchText);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="SubtitleList scroll"
            ref={listRef}
            width={width}
            height={height}
            rowCount={subtitles.length}
            rowHeight={cache.rowHeight}
            rowRenderer={params => rowRenderer(params, subtitles)}
            style={{ outline: "none" }}
          />
        )}
      </AutoSizer>
    </div>
  );
});
