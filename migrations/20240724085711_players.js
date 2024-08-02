exports.up = function (knex) {
    return knex.schema.createTable('players', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
        table.timestamp('joined_at').defaultTo(knex.fn.now());
        table.unique(['room_id', 'user_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('players');
};
