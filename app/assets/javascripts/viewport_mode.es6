class ViewportMode {
  static getMode() {
    const envs = ["xs", "sm", "md", "lg"];
    const doc = window.document;
    const temp = doc.createElement("div");

    doc.body.appendChild(temp);

    for (var i = envs.length - 1; i >= 0; i--) {
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
