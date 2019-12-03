import React from "react";
import "./SideTranscription.scss";
import "../../styles/theme.scss";
import SubtitleList from "../SubtitleList";
import SubtitleListMenu from "../SubtitleListMenu";
import Loader from "react-loader-spinner";
import testSubtitles from "../../assets/testSubtitles.json";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.loadMessages = [
      "No subtitles",
      "Loading error :(",
      "Reload YouTube please"
    ];
    this.state = {
      theme: undefined,
      loading: false,
      subtitles: testSubtitles,
      currentLanguage: "en",
      loadMessage: "",
      favoriteFilter: false,
      searchText: ""
    };
  }
  changeTheme(nextTheme) {
    if (!nextTheme) {
      const oldTheme = this.state.theme;
      if (oldTheme === "light") {
        nextTheme = "dark";
      } else {
        nextTheme = "light";
      }
    }
    this.setState({ theme: nextTheme });
    this.changeBodyClassTheme(nextTheme);
  }
  changeBodyClassTheme(newTheme) {
    document.body.className = newTheme === "dark" ? "dark-theme" : "";
  }
  getLanguages(subtitles = this.state.subtitles) {
    if (!subtitles) return [];
    return Object.keys(subtitles);
  }
  changeLang = lang => {
    this.setState({
      currentLanguage: lang
    });
  };
  changeFavoriteFilter = _ => {
    this.setState(prevState => ({
      favoriteFilter: !prevState.favoriteFilter
    }));
  };
  changeSearchText = newText => {
    this.setState({
      searchText: newText
    });
  };
  componentDidMount() {
    // this.changeTheme('dark')
    this.messageListener = e => {
			if (e.origin !== window.location.origin) return;
      const message = e.data;
      if (message.type === "changePage") {
        this.setState({
          loading: true
        });
      } else if (message.type === "subtitles") {
        const subtitles = message.data;
        let newSubtitles;
        let newText;
        if (subtitles.list && Object.keys(subtitles.list).length > 0) {
          newSubtitles = subtitles.list;
          newText = "";
        } else {
          newSubtitles = undefined;
          newText = this.loadMessages[0];
        }
        if (subtitles.error) {
          newText = this.loadMessages[1];
        }
        this.setState({
          loading: false,
          subtitles: newSubtitles,
          currentLanguage: this.getLanguages(newSubtitles)[0],
          loadMessage: newText
        });
      } else if (message.type === "videoEvents") {
        if (message.data.timeupdate) {
          this.setState({ videoTime: message.data.timeupdate });
        }
      } 
    };
    window.addEventListener("message", this.messageListener, false);
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.messageListener);
  }
  render() {
    let subtitleListMenu, subtitleList;
    if (this.state.subtitles && this.state.currentLanguage) {
      subtitleListMenu = (
        <SubtitleListMenu
          languages={this.getLanguages()}
          currentLanguage={this.state.currentLanguage}
          changeLang={this.changeLang}
          favoriteFilter={this.state.favoriteFilter}
          changeFavoriteFilter={this.changeFavoriteFilter}
          searchText={this.state.searchText}
          changeSearchText={this.changeSearchText}
        />
      );
      subtitleList = (
        <SubtitleList
          subtitles={this.state.subtitles[this.state.currentLanguage]}
          videoTime={this.state.videoTime}
          favoriteFilter={this.state.favoriteFilter}
          searchText={this.state.searchText}
        ></SubtitleList>
      );
    } else {
      subtitleList = (
        <div className="load-message">{this.state.loadMessage}</div>
      );
    }
    const spinner = (
      <Loader type="TailSpin" color="var(--main)" height={80} width={80} />
    );
    return (
      <div className="App">
        {subtitleListMenu}
        <div className="content">
          {this.state.loading ? spinner : subtitleList}
        </div>
      </div>
    );
  }
}
