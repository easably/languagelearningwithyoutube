import React, { useEffect, Fragment } from "react";
import "./SideTranscription.scss";
import "../../styles/theme.scss";
import SubtitleList from "./SubtitleList";
import SubtitleListMenu from "./SubtitleListMenu";
import Loader from "react-loader-spinner";
import { useLocalStore, observer } from "mobx-react-lite";
import store from "../../store";

export default observer(props => {
  const state = useLocalStore(() => ({
    loading: false,
    loadMessage: ""
  }));
  const loadMessages = [
    "No subtitles",
    "Loading error :(",
    "Reload YouTube please"
  ];
  const toggleLoading = st => {
    state.loading = st === undefined ? !state.loading : st;
  };
  const setLoadMessage = msg => {
    state.loadMessage = msg;
  };
  useEffect(() => {
    // store.main.changeTheme('dark')
    let messageListener = e => {
      if (e.origin !== window.location.origin) return;
      const message = e.data;
      if (message.type === "changePage") {
        toggleLoading(true);
      } else if (message.type === "subtitles") {
        const subtitles = message.data;
        let newSubtitles;
        let newText;
        if (subtitles.list && Object.keys(subtitles.list).length > 0) {
          newSubtitles = subtitles.list;
          newText = "";
        } else {
          newSubtitles = undefined;
          newText = loadMessages[0];
        }
        if (subtitles.error) {
          newText = loadMessages[1];
        }
        toggleLoading(false);
        setLoadMessage(newText);
        store.subtitles.setSubtitles(newSubtitles);
        store.subtitles.changeLang(store.subtitles.subtitleLanguages[0]);
      } else if (message.type === "videoEvents") {
        if (message.data.timeupdate) {
          store.subtitles.setVideoTime(message.data.timeupdate);
        }
      }
    };
    window.addEventListener("message", messageListener, false);
    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, []);

  let subtitleListMenu, subtitleList;
  if (store.subtitles.subtitles && store.subtitles.subtitleLanguage) {
    subtitleListMenu = <SubtitleListMenu />;
    subtitleList = <SubtitleList />;
  } else {
    subtitleList = <div className="load-message">{state.loadMessage}</div>;
  }
  const spinner = (
    <Loader type="TailSpin" color="var(--main)" height={80} width={80} />
  );
  return (
    <Fragment>
      {subtitleListMenu}
      <div className="content">{state.loading ? spinner : subtitleList}</div>
    </Fragment>
  );
});
