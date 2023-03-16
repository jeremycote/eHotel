exports.up = async function (sql) {
  // Important because we almost always get our user using their email address
  await sql`CREATE OR REPLACE VIEW hotels_by_zone (zone, n_hotels) AS
                SELECT z.name AS zone, COUNT(h.hotel_id) AS n_hotels
                FROM zones z INNER JOIN hotels h ON z.zone_id = h.zone_id
                GROUP BY z.name;`;
};

exports.down = async function (sql) {
  await sql`DROP VIEW IF EXISTS hotels_by_zone`;
};
