import React from "react";
import "./SubtitleList.scss";
import videoAction from "../../services/videoAction";
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
    this.state = {
      current: undefined,
      subtitlesOption: {}
    };
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 53,
      minHeight: 53
    });
    this.listRef = React.createRef();
  }
  clickOnItem = startTime => {
    videoAction.setTime(startTime)
  };
  _toggleStateParam(key, param) {
    this.setState(prevState => {
      let newSubOpt = { ...prevState.subtitlesOption };
      if (!newSubOpt[key]) newSubOpt[key] = {};
      newSubOpt[key][param] = !newSubOpt[key][param];
      return { subtitlesOption: newSubOpt };
    });
  }
  handleCheckItem = key => {
    this.clickChecked(key)
  };
  clickChecked(id) {
    const options = this.state.subtitlesOption;
    const checkedList = Object.keys(options).filter(k => options[k].checked);
    if (checkedList.every(e => +e !==  +id)) {
      checkedList.push(id);
      if (checkedList.length === 1) {
        videoAction.pause()
      }
      let min = Math.min(...checkedList);
      let max = Math.max(...checkedList);
      let newCheckedList = [];
      for (let i = min; i <= max; i++) {
        newCheckedList.push(i);
      }
      this.setCheckedKeysToOption(newCheckedList);
    } else {
      if (id >= checkedList[Math.floor(checkedList.length / 2)]) {
        this.setCheckedKeysToOption(checkedList.filter(e => +e < +id));
      } else {
        this.setCheckedKeysToOption(checkedList.filter(e => +e > +id));
      }
    }
  }
  setCheckedKeysToOption(list) {
    this.setState(prevState => {
			let newSubOpt = { ...prevState.subtitlesOption };
			Object.keys(newSubOpt).forEach(id=>{
				if (!newSubOpt[id]) newSubOpt[id] = {};
				newSubOpt[id].checked = false;
			})
      list.forEach(id => {
				if (!newSubOpt[id]) newSubOpt[id] = {};
				newSubOpt[id].checked = true;
      });
      return { subtitlesOption: newSubOpt };
    });
  }
  handleFavItem = key => {
    this._toggleStateParam(key, "favorite");
  };
  handleSetOtherFuncItem = (key, func) => {
    this.setState(prevState => {
      let newSubOpt = { ...prevState.subtitlesOption };
      if (!newSubOpt[key]) newSubOpt[key] = {};
      newSubOpt[key].otherFunc = func;
      return { subtitlesOption: newSubOpt };
    });
  };
  rowRenderer = ({ index, key, parent, style }, subtitles) => {
    let subtitle = subtitles[index];
    let curSubtitleOption = this.state.subtitlesOption[subtitle.id] || {};
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
              this.props.videoTime >= subtitle.startTime &&
              this.props.videoTime < subtitle.endTime
            }
            text={subtitle.text}
            handleClick={_ => this.clickOnItem(subtitle.startTime)}
            handleCheck={_ => this.handleCheckItem(subtitle.id)}
            isChecked={curSubtitleOption.checked}
            handleFavorite={_ => this.handleFavItem(subtitle.id)}
            isFavorite={curSubtitleOption.favorite}
            handleSetOtherFunc={func =>
              this.handleSetOtherFuncItem(subtitle.id, func)
            }
            activeOtherFunc={curSubtitleOption.otherFunc}
            startTime={subtitle.startTime}
            key={key}
          />
        )}
      </CellMeasurer>
    );
  };
  filterText(subtitles, text) {
    return subtitles.filter(
      s => s.text.toUpperCase().indexOf(text.toUpperCase()) !== -1
    );
  }
  filterFavorite(subtitles) {
    const option = this.state.subtitlesOption;
    let favKeys = Object.keys(option);
    favKeys = favKeys.filter(key => option[key].favorite);
    return subtitles.filter(sub => favKeys.some(key => key === sub.id));
  }
  render() {
    let subtitles = this.props.subtitles;
    if (this.props.favoriteFilter) subtitles = this.filterFavorite(subtitles);
    if (this.props.searchText)
      subtitles = this.filterText(subtitles, this.props.searchText);
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
