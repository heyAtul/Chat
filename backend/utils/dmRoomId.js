// Room id of a one-to-one chat: both user ids sorted and joined with "-",
// so A→B and B→A give the same id. The frontend has the same function in src/utils/dmRoomId.js.
export const dmRoomId = (userId, otherUserId) => [String(userId), String(otherUserId)].sort().join("-");
