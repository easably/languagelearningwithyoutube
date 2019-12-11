import { observable, action } from "mobx";

class MainStore {
  @observable theme = "";
  @action changeTheme(nextTheme) {
    if (!nextTheme) {
      const oldTheme = this.theme;
      if (oldTheme === "light") {
        nextTheme = "dark";
      } else {
        nextTheme = "light";
      }
    }
    this.theme = nextTheme;
    this._changeBodyClassTheme(nextTheme);
  }
  _changeBodyClassTheme(newTheme) {
    document.body.className = newTheme === "dark" ? "dark-theme" : "";
  }
}
export default MainStore;
