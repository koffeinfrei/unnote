import AbstractFlash from './AbstractFlash';

class AlertFlash extends AbstractFlash {
  getName() {
    return 'alert';
  }

  getAdditionalCssClass() {
    return 'warning';
  }
}

export default AlertFlash;
