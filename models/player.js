const { Model } = require('objection');

class Player extends Model {
    static get tableName() {
        return 'players';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'room_id', 'joined_at'],
            properties: {
                id: { type: 'integer' },
                user_id: { type: 'integer' },
                room_id: { type: 'integer' },
                joined_at: { type: 'string', format: 'date-time' },
            },
        };
    }

    // static get relationMappings() {
    //     const Room = require('./Room');
    //     return {
    //         room: {
    //             relation: Model.BelongsToOneRelation,
    //             modelClass: Room,
    //             join: {
    //                 from: 'players.room_id',
    //                 to: 'rooms.id',
    //             },
    //         },
    //     };
    // }
}

module.exports = Player;
