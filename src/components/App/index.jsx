import React from "react";
import "./App.scss";
import "../../styles/theme.scss";
import isElectron from "is-electron";
import SubtitleList from "../SubtitleList";
import SubtitleListMenu from "../SubtitleListMenu";
import Loader from "react-loader-spinner";

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
      subtitles: undefined,
      currentLanguage: undefined,
      loadMessage: ''
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
  componentDidMount() {
    // this.changeTheme('dark')
    if (isElectron()) {
      window.ipcRenderer.on("changePage", _ => {
        this.setState({
          loading: true
        });
      });
      window.ipcRenderer.on("subtitles", (e, subtitles) => {
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
        console.log({
          loading: false,
          subtitles: newSubtitles,
          currentLanguage: this.getLanguages(newSubtitles)[0],
          loadMessage: newText
        });
        this.setState({
          loading: false,
          subtitles: newSubtitles,
          currentLanguage: this.getLanguages(newSubtitles)[0],
          loadMessage: newText
        });
      });
      window.ipcRenderer.on("videoControl", (e, data) => {
        if (data.timeupdate) {
          this.setState({ videoTime: data.timeupdate });
        }
      });
    }
  }
  render() {
    let subtitleListMenu, subtitleList;
    if (this.state.subtitles && this.state.currentLanguage) {
      subtitleListMenu = (
        <SubtitleListMenu
          languages={this.getLanguages()}
          currentLanguage={this.state.currentLanguage}
          changeLang={this.changeLang}
        />
      );
      subtitleList = (
        <SubtitleList
          subtitles={this.state.subtitles[this.state.currentLanguage]}
          videoTime={this.state.videoTime}
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
