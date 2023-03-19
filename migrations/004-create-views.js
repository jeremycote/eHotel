exports.up = async function (sql) {
  // Important because we almost always get our user using their email address
  await sql`CREATE OR REPLACE VIEW hotels_by_zone (zone, n_hotels) AS
                SELECT z.name AS zone, COUNT(h.hotel_id) AS n_hotels
                FROM zones z INNER JOIN hotels h ON z.zone_id = h.zone_id
                GROUP BY z.name;`;

  await sql`CREATE OR REPLACE VIEW room_capacities_by_hotel (hotel_id, room_id, capacity, type) AS
              SELECT r.hotel_id AS hotel_id, r.room_id as room_id, r.capacity as capacity, t.name as type
              FROM rooms r JOIN room_types t ON r.room_type_id = t.room_type_id GROUP BY r.hotel_id, r.room_id, t.name;`;
};

exports.down = async function (sql) {
  await sql`DROP VIEW IF EXISTS hotels_by_zone`;
  await sql`DROP VIEW IF EXISTS room_capacities_by_hotel`;
};
