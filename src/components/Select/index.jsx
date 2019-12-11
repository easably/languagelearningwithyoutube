import React from "react";
import classNames from "classnames";
import "./Select.scss";
import ModalBackdor from "../ModalBackdrop";
import { useLocalStore, observer } from "mobx-react-lite";

export default observer(props => {
  const state = useLocalStore(() => ({
    open: false,
    toggleOpen: function() {
      this.open = !this.open;
    }
  }));

  let change = param => {
    props.onChange(param);
    state.toggleOpen();
  };

  if (!props.items) return null;
  const list = props.items.map((l, i) => {
    const classesItem = classNames("select-list-item", {
      active: l === props.value
    });
    return (
      <li className={classesItem} onClick={e => change(l)} key={i}>
        {l}
      </li>
    );
  });
  const classesList = classNames("select-list", {
    open: state.open
  });
  return (
    <div className="select">
      <div className="select__main">
        <div className="select-current" onClick={state.toggleOpen}>
          {props.value}
        </div>
        <ul className={classesList}>{list}</ul>
        {state.open && <ModalBackdor onClose={state.toggleOpen} />}
      </div>
    </div>
  );
});
