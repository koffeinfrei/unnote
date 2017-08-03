import AbstractFlash from 'components/abstract_flash';

class AlertFlash extends AbstractFlash {
  getName() {
    return 'alert';
  }

  getAdditionalCssClass() {
    return 'alert-warning';
  }
}

export default AlertFlash;
