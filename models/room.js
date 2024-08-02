const { Model } = require('objection');
// const Player = require('./Player');

class Room extends Model {
    static get tableName() {
        return 'rooms';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['room_code'],
            properties: {
                id: { type: 'integer' },
                user_id: { type: 'integer' },
                room_code: { type: 'string', minLength: 1, maxLength: 10 },
                created_at: { type: 'string', format: 'date-time' },
            },
        };
    }

    static get relationMappings() {
        const Player = require('./player');
        return {
            players: {
                relation: Model.HasManyRelation,
                modelClass: Player,
                join: {
                    from: 'rooms.id',
                    to: 'players.room_id',
                },
            },
        };
    }
}

module.exports = Room;
