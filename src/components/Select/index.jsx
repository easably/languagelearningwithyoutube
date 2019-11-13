import React from "react";
import classNames from "classnames";
import "./Select.scss";

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
    componentDidMount(){
        this.listener =  e=>{
            if (!e.path.some(e=>e===this.ref.current) && this.state.open){
                this.setState({
                    open: false
                })
            }
        }
        document.addEventListener('click',this.listener)
    }
    componentWillUnmount(){
        document.removeEventListener('click',this.listener)

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
                </div>
            </div>
        );
    }
}
