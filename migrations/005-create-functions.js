exports.up = async function (sql) {
  await sql`CREATE OR REPLACE FUNCTION get_hotel_chains_json()
                RETURNS JSON
                LANGUAGE sql SECURITY DEFINER AS
                $func$
                SELECT json_agg(sub)
                FROM (
                    SELECT ch.chain_id, ch.name
                    FROM  hotel_chains ch
                    ) sub
                $func$;`;

  await sql`CREATE OR REPLACE FUNCTION get_zones_json()
                RETURNS JSON
                LANGUAGE sql SECURITY DEFINER AS
                $func$
                SELECT json_agg(sub)
                FROM (
                    SELECT z.*
                    FROM  zones z
                    ) sub
                $func$;`;

  await sql`CREATE OR REPLACE FUNCTION get_categories_json()
                RETURNS JSON
                LANGUAGE sql SECURITY DEFINER AS
                $func$
                SELECT json_agg(sub)
                FROM (
                    SELECT c.*
                    FROM  categories c
                    ) sub
                $func$;`;
};

exports.down = async function (sql) {
  await sql`DROP FUNCTION IF EXISTS get_hotel_chains_json`;
  await sql`DROP FUNCTION IF EXISTS get_zones_json`;
  await sql`DROP FUNCTION IF EXISTS get_categories_json`;
};
