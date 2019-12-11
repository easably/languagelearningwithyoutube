import React from "react";
import "./SideTranscription.scss";
import "../../styles/theme.scss";
import SubtitleList from "../SubtitleList";
import SubtitleListMenu from "../SubtitleListMenu";
import Loader from "react-loader-spinner";
import { observer, Provider } from "mobx-react";
import store from "../../store";
import { observable } from "mobx";

@observer
class App extends React.Component {
  @observable loading = false;
  @observable loadMessage = "";
  loadMessages = [
		"No subtitles",
		"Loading error :(",
		"Reload YouTube please"
	];

  componentDidMount() {
    // store.main.changeTheme('dark')
    this.messageListener = e => {
      if (e.origin !== window.location.origin) return;
      const message = e.data;
      if (message.type === "changePage") {
        this.loading = true;
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
        this.loading = false;
        this.loadMessage = newText;
        store.subtitles.setSubtitles(newSubtitles);
        store.subtitles.changeLang(store.subtitles.subtitleLanguages[0]);
      } else if (message.type === "videoEvents") {
        if (message.data.timeupdate) {
          store.subtitles.setVideoTime(message.data.timeupdate);
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
    if (store.subtitles.subtitles && store.subtitles.subtitleLanguage) {
      subtitleListMenu = <SubtitleListMenu />;
      subtitleList = <SubtitleList />;
    } else {
      subtitleList = <div className="load-message">{this.loadMessage}</div>;
    }
    const spinner = (
      <Loader type="TailSpin" color="var(--main)" height={80} width={80} />
    );
    return (
      <Provider {...store}>
        {subtitleListMenu}
        <div className="content">{this.loading ? spinner : subtitleList}</div>
      </Provider>
    );
  }
}
export default App;
