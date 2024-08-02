exports.up = function (knex) {
    return knex.schema.createTable('rooms', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.string('room_code', 10).unique().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('rooms');
};