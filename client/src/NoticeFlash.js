import AbstractFlash from './AbstractFlash';

class NoticeFlash extends AbstractFlash {
  getName() {
    return 'notice';
  }

  getAdditionalCssClass() {
    return 'alert-info';
  }
}

export default NoticeFlash;
