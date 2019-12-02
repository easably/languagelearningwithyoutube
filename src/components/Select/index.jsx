import React from "react";
import classNames from "classnames";
import "./Select.scss";
import ModalBackdor from '../ModalBackdrop';

export default class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.ref = React.createRef()
    }

    toggleSelect = () => {
        this.setState(state => {
            return { open: !state.open };
        });
    };
    change = (param) => {
        this.props.onChange(param);
        this.toggleSelect();
    }
    render() {
        if (!this.props.items) return;
        const list = this.props.items.map((l, i) => {
            const classesItem = classNames("select-list-item",{
                active: l === this.props.value
            })
            return (
                <li
                    className={classesItem}
                    onClick={e=>this.change(l)}
                    key={i}
                >
                    {l}
                </li>
            );
        });
        const classesList = classNames("select-list", {
            open: this.state.open
        });
        return (
            <div className="select" ref = {this.ref}>
                <div className="select__main">
                    <div className="select-current" onClick={this.toggleSelect}>
                        {this.props.value}
                    </div>
                    <ul className={classesList}>{list}</ul>
										{this.state.open && <ModalBackdor onClose={this.toggleSelect}/>}
                </div>
            </div>
        );
    }
}
