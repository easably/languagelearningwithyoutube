import React from "react";
import "./Navigation.scss";
import leftArrowIco from "../../assets/icons/left-arrow.svg";
import rightArrowIco from "../../assets/icons/right-arrow.svg";
import reloadIco from "../../assets/icons/reload.svg";
import stopIco from "../../assets/icons/stop.svg";
import navEvents from "../../services/navEvents";

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: false,
            backBtnActive: false,
            forwardBtnActive: false,
            url: "",
            inputUrl: ""
        };
    }
    componentDidMount() {
        navEvents.on("didStartLoading", () => {
            this.setState({ reload: true });
        });
        navEvents.on("didStopLoading", () => {
            this.setState({ reload: false });
        });
        navEvents.on("canGoForward", can => {
            this.setState({ forwardBtnActive: can });
        });
        navEvents.on("canGoBack", can => {
            this.setState({ backBtnActive: can });
        });
        navEvents.on("changeURL", url => {
            this.setState({
                url: url,
                inputUrl: this.getUrlParts(url).parthname
            });
        });
    }
    componentWillUnmount() {
        navEvents.removeListeners();
    }
    getUrlParts(url) {
        let match = url.match(/(https?:\/\/www.([^/]*)\/?)(.*$)/);
        if (!match) return { host: "", origin: "", parthname: "" };
        return {
            host: match[2],
            origin: match[1],
            parthname: match[3]
        };
    }
    handleChange = e => {
        this.setState({
            inputUrl: e.target.value
        });
    };
    handleEnter = e => {
        if (e.key === "Enter") {
            const newUrl =
                this.getUrlParts(this.state.url).origin + this.state.inputUrl;
            navEvents.send.setURL(newUrl);
            e.target.blur();
        }
    };
    render() {
        return (
            <div className="Navigation">
                <div
                    className={
                        "nav-item btn back " +
                        (!this.state.backBtnActive ? "noActive" : "")
                    }
                    onClick={
                        this.state.backBtnActive
                            ? navEvents.send.goBack
                            : undefined
                    }
                >
                    <img
                        src={leftArrowIco}
                        width="100%"
                        height="100%"
                        alt="leftArrow"
                    ></img>
                </div>
                <div
                    className={
                        "nav-item btn forward " +
                        (!this.state.forwardBtnActive ? "noActive" : "")
                    }
                    onClick={
                        this.state.forwardBtnActive
                            ? navEvents.send.goForward
                            : undefined
                    }
                >
                    <img
                        src={rightArrowIco}
                        width="100%"
                        height="100%"
                        alt="rightArrow"
                    ></img>
                </div>
                <div
                    className="nav-item btn reload"
                    onClick={
                        this.state.reload
                            ? navEvents.send.stopReload
                            : navEvents.send.reload
                    }
                >
                    <img
                        src={this.state.reload ? stopIco : reloadIco}
                        width="100%"
                        height="100%"
                        alt="stop"
                    ></img>
                </div>
                <div className="nav-item url-wrapper">
                    <div className="url url__disable">
                        {this.getUrlParts(this.state.url).host}
                    </div>
                    <input
                        type="text"
                        className="url url__enable"
                        value={this.state.inputUrl}
                        onChange={e => {
                            this.handleChange(e);
                        }}
                        onKeyDown={e => {
                            this.handleEnter(e);
                        }}
                    />
                </div>
            </div>
        );
    }
}
