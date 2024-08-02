const Room = require('../models/room');
const jwt = require('jsonwebtoken');
const Player = require('../models/player');

class RoomService {

    async createRoom(user_id) {
        try {
            let room_code = Math.random().toString(36).substring(2, 8);
            const room = await Room.query().insert({ room_code: room_code, user_id: user_id });
            return room;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    // joinRoom(user_id, room_id);
    async joinRoom(user_id, room_code) {
        try {
            const room = await Room.query().where('room_code', room_code).first();
            if (!room) {
                throw new Error('Room not found');
            }
            let room_id = room.id;
            const player = await Player.query().where('room_id', room_id);
            if (player.length >= 4) {
                throw new Error('Room is full');
            }

            let joined_at = new Date().toISOString();
            const players = await room.$relatedQuery('players').insert({ user_id: user_id, room_id: room_id, joined_at: joined_at });
            return players;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new RoomService();