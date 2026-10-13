export function getKioskId() {
  let id = localStorage.getItem('kiosk_id');
  if (!id) {
    id = 'kiosk_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('kiosk_id', id);
  }
  return id;
}