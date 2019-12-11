import React from "react";
import "./SubtitleListMenu.scss";
import searchIcon from "../../assets/icons/search.svg";
import ReactSVG from "react-svg";
import Select from "../Select";
import filterIcon from "../../assets/icons/favorite.svg";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import store from "../../store";

export default observer(props => {
  const classes = {
    favoriteFilter: classNames("favorite-filter", {
      active: store.subtitles.favoriteFilter
    })
  };

  return (
    <div className="SubtitleListMenu">
      <div className="SubtitleListMenu_part">
        <Select
          value={store.subtitles.subtitleLanguage}
          onChange={e => store.subtitles.changeLang(e)}
          items={store.subtitles.subtitleLanguages}
        ></Select>
      </div>
      <div className="SubtitleListMenu_part">
        <div
          onClick={_ => store.subtitles.changeFavoriteFilter()}
          className={classes.favoriteFilter}
        >
          <ReactSVG src={filterIcon} className="svg" />
        </div>
        <div className="search">
          <ReactSVG src={searchIcon} className="svg search-icon" />
          <input
            type="search"
            placeholder="Search"
            className="search-input"
            value={store.subtitles.searchText}
            onChange={e => store.subtitles.changeSearchText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
});
