import React from "react";
import "./SubtitleListMenu.scss";
import searchIcon from "../../assets/icons/search.svg";
import ReactSVG from "react-svg";
import Select from "../Select";
import filterIcon from "../../assets/icons/favorite.svg";
import classNames from "classnames";

export default class SubtitleListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openLangList: false
    };
  }
  changeLang = e => {
    this.props.changeLang(e);
  };
  render() {
    const favoriteFilterClass = classNames("favorite-filter", {
      active: this.props.favoriteFilter
    });
    return (
      <div className="SubtitleListMenu">
        <div className="SubtitleListMenu_part">
          <Select
            value={this.props.currentLanguage}
            onChange={this.changeLang}
            items={this.props.languages}
          ></Select>
        </div>
        <div className="SubtitleListMenu_part">
          <div
            onClick={this.props.changeFavoriteFilter}
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
              value={this.props.searchText}
              onChange={e => this.props.changeSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}
