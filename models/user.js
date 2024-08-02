const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['googleId', 'email', 'name'],

      properties: {
        id: { type: 'integer' },
        googleId: { type: 'string' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' }
      }
    };
  }
}

module.exports = User;
