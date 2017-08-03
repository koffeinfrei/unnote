import AbstractFlash from 'components/abstract_flash';

class NoticeFlash extends AbstractFlash {
  getName() {
    return 'notice';
  }

  getAdditionalCssClass() {
    return 'alert-info';
  }
}

export default NoticeFlash;
