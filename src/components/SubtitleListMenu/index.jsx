import React from "react";
import "./SubtitleListMenu.scss";
import searchIcon from "../../assets/icons/search.svg";
import ReactSVG from "react-svg";
import Select from '../Select'

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
        return (
            <div className="SubtitleListMenu">
                <Select
                    value={this.props.currentLanguage}
                    onChange={this.changeLang}
                    items={this.props.languages}
                ></Select>

                <div className="search">
                    <ReactSVG src={searchIcon} className="svg search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                    />
                </div>
            </div>
        );
    }
}
