import React from "react";
import "./SubtitleListMenu.scss";
import searchIcon from "../../assets/icons/search.svg";
import ReactSVG from "react-svg";
import Select from "../Select";
import filterIcon from "../../assets/icons/favorite.svg";
import classNames from "classnames";
import { inject, observer } from "mobx-react";

@inject("subtitles")
@observer
class SubtitleListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openLangList: false
    };
  }
  changeLang = e => {
    this.props.subtitles.changeLang(e);
  };
  render() {
    const favoriteFilterClass = classNames("favorite-filter", {
      active: this.props.subtitles.favoriteFilter
    });
    return (
      <div className="SubtitleListMenu">
        <div className="SubtitleListMenu_part">
          <Select
            value={this.props.subtitles.subtitleLanguage}
            onChange={this.changeLang}
            items={this.props.subtitles.subtitleLanguages}
          ></Select>
        </div>
        <div className="SubtitleListMenu_part">
          <div
            onClick={_=>this.props.subtitles.changeFavoriteFilter()}
            className={favoriteFilterClass}
          >
            <ReactSVG src={filterIcon} className="svg" />
          </div>
          <div className="search">
            <ReactSVG src={searchIcon} className="svg search-icon" />
            <input
              type="search"
              placeholder="Search"
              className="search-input"
              value={this.props.subtitles.searchText}
              onChange={e => this.props.subtitles.changeSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default SubtitleListMenu;
