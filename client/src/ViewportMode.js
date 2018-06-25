// https://stackoverflow.com/questions/19462672/jquery-detect-bootstrap-3-state/24884634#24884634
class ViewportMode {
  static getMode() {
    const envs = ["xs", "sm", "md", "lg"];
    const doc = window.document;
    const temp = doc.createElement("div");

    doc.body.appendChild(temp);

    for (let i = envs.length - 1; i >= 0; i--) {
      const env = envs[i];

      temp.className = "hidden-" + env;

      if (temp.offsetParent === null) {
        doc.body.removeChild(temp);
        return env;
      }
    }
    return "";
  }

  static isMobileMode() {
    const mode = this.getMode();
    return mode === 'xs' || mode === 'sm';
  }
}

export default ViewportMode;
