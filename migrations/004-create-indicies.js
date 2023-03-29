/**
 * The following query gives all indexes:
 * SELECT
tablename as "TableName",
indexname as "Index Name",
indexdef as "Index script"
FROM
pg_indexes
WHERE
schemaname = 'public'
ORDER BY
tablename,
indexname; 
 */

exports.up = async function (sql) {
  // Important because we almost always get our user using their email address
  await sql`CREATE INDEX IF NOT EXISTS ix_hotel_chain_ids ON hotels(chain_id)`;
  await sql`CREATE INDEX IF NOT EXISTS ix_room_hotel_ids ON rooms(hotel_id)`;
  await sql`CREATE INDEX IF NOT EXISTS ix_reservation_room_ids ON reservations(room_id)`;
};

exports.down = async function (sql) {
  await sql`DROP INDEX IF EXISTS ix_hotel_chain_ids`;
  await sql`DROP INDEX IF EXISTS ix_room_hotel_ids`;
  await sql`DROP INDEX IF EXISTS ix_reservation_room_ids`;
};
