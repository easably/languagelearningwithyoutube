import React from "react";
import "./App.scss";
import isElectron from "is-electron";
import SubtitleList from "../SubtitleList";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            subtitles: undefined,
            currentLanguage: "en",
            text: ""
        };
    }
    getLanguages() {
        return Object.keys(this.state.subtitles);
    }
    componentDidMount() {
        if (isElectron()) {
            window.ipcRenderer.on("changePage", _ => {
                this.setState({
                    loading: true
                });
            });
            window.ipcRenderer.on("subtitles", (e, subtitles) => {
                console.log(subtitles);
                let newSubtitles;
                let newText;
                if (subtitles.list && Object.keys(subtitles.list).length > 0) {
                    newSubtitles = subtitles.list;
                    newText = "";
                } else {
                    newSubtitles = undefined;
                    newText = "No subtitles";
                }
                if (subtitles.error) {
                    newText = "Loading error :(";
                }
                this.setState({
                    loading: false,
                    subtitles: newSubtitles,
                    text: newText
                });
            });
            window.ipcRenderer.on("videoControl", (e, data) => {
                console.log(data);
                if (data.timeupdate){
                    this.setState({videoTime:data.timeupdate})
                }
            });
        }
    }
    render() {
        const langButtons =
            this.state.subtitles &&
            this.getLanguages().map(l => (
                <button
                    key={l}
                    style={{ width: "100%" }}
                    onClick={_ => this.setState({ currentLanguage: l })}
                >
                    {l}
                </button>
            ));
        return (
            <div className="App">
                {langButtons}
                <SubtitleList
                    loading={this.state.loading}
                    subtitles={
                        this.state.subtitles &&
                        this.state.subtitles[this.state.currentLanguage]
                    }
                    text={this.state.text}
                    videoTime={this.state.videoTime}
                ></SubtitleList>
            </div>
        );
    }
}
