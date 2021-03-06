import AbstractFlash from './AbstractFlash';

class NoticeFlash extends AbstractFlash {
  getName() {
    return 'notice';
  }

  getAdditionalCssClass() {
    return 'success';
  }
}

export default NoticeFlash;
