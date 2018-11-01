import EventHive from './EventHive';
import NoticeFlash from './NoticeFlash';
import AlertFlash from './AlertFlash';

// expose certain globals that are needed by the mobile app
export default function setGlobals() {
  window.EventHive = EventHive;
  window.NoticeFlash = NoticeFlash;
  window.AlertFlash = AlertFlash;
}
