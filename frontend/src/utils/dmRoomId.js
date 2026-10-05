// Room id of a one-to-one chat: both user ids sorted and joined with "-".
// Must match dmRoomId in the backend's socket/message.handler.js.
export const dmRoomId = (userId, otherUserId) => [userId, otherUserId].sort().join("-");
