import { observable, action, computed } from "mobx";
import testSubtitles from "../assets/testSubtitles.json";
import videoAction from "../services/videoAction";

class SubtitlesStore {
  @observable subtitles = new Map();
  @observable subtitleLanguage = "en";
  @observable favoriteFilter = false;
  @observable searchText = "";
  @observable videoTime = 0;
  @observable subtitlesOption = {};
  constructor() {
    this.setSubtitles(testSubtitles);
  }
  @action setSubtitles(subtitles) {
    if (!subtitles) {
      this.subtitles.clear();
    } else {
      this.subtitles = observable.map(Object.entries(subtitles));
		}
		/*
		* Save video favorites in local storage
		*/
		this.subtitlesOption = {};
  }
  @computed get subtitleLanguages() {
    var mapIter = this.subtitles.keys();
    let value = mapIter.next().value;
    let langs = [];
    while (value) {
      langs.push(value);
      value = mapIter.next().value;
    }
    return langs;
  }
  @computed get selectLangSubtitles() {
    return this.subtitles.get(this.subtitleLanguage);
  }
  @action changeLang(lang) {
    this.subtitleLanguage = lang;
  }
  @action changeFavoriteFilter() {
    this.favoriteFilter = !this.favoriteFilter;
  }
  @action changeSearchText(newText) {
    this.searchText = newText;
  }
  @action setVideoTime(time) {
    this.videoTime = time;
  }

  @action handleCheckItem = key => {
    const options = this.subtitlesOption;
    let checkedList = Object.keys(options).filter(i => {
      return options[i].checked;
    });
    if (checkedList.every(e => +e !== +key)) {
      checkedList.push(key);
      if (checkedList.length === 1) {
        videoAction.pause();
      }
      let min = Math.min(...checkedList);
      let max = Math.max(...checkedList);
      let newCheckedList = [];
      for (let i = min; i <= max; i++) {
        newCheckedList.push(i);
      }
      this.setCheckedKeysToOption(newCheckedList);
    } else {
      if (key >= checkedList[Math.floor(checkedList.length / 2)]) {
        this.setCheckedKeysToOption(checkedList.filter(e => +e < +key));
      } else {
        this.setCheckedKeysToOption(checkedList.filter(e => +e > +key));
      }
    }
  };
  _toggleOptionParam(key, param) {
    this._createOptionParam(key);
    this.subtitlesOption[key][param] = !this.subtitlesOption[key][param];
  }
  _createOptionParam(key) {
    if (!this.subtitlesOption[key]) this.subtitlesOption[key] = {};
  }
  @action setCheckedKeysToOption(list) {
    Object.keys(this.subtitlesOption).forEach(i => {
      this._createOptionParam(i);
      this.subtitlesOption[i].checked = false;
    });
    list.forEach(id => {
      this._createOptionParam(id);
      this.subtitlesOption[id].checked = true;
    });
  }
  @action handleFavItem = key => {
    this._toggleOptionParam(key, "favorite");
  };

  @action handleSetOtherFuncItem = (key, func) => {
    this._createOptionParam(key);
    this.subtitlesOption[key].otherFunc = func;
  };
}
export default SubtitlesStore;
