export function generateRoomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function saveTeamSession(roomCode, teamId) {
  sessionStorage.setItem('tc_room_code', roomCode);
  sessionStorage.setItem('tc_team_id', teamId);
}

export function loadTeamSession() {
  const roomCode = sessionStorage.getItem('tc_room_code');
  const teamId = sessionStorage.getItem('tc_team_id');
  if (roomCode && teamId) return { roomCode, teamId };
  return null;
}

export function clearTeamSession() {
  sessionStorage.removeItem('tc_room_code');
  sessionStorage.removeItem('tc_team_id');
}