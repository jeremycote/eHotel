exports.up = async function (sql) {
  await sql`
        CREATE OR REPLACE FUNCTION check_lease_exists()
            RETURNS TRIGGER
            LANGUAGE PLPGSQL
        AS
        $$
        BEGIN
            if not exists (
                select lease_id
                from leases l
                where l.reservation_id = NEW.reservation_id
                ) then
            RETURN NEW;
            end if;
            raise exception 'LEASE ALREADY EXISTS';
        END;
        $$
    `;

  await sql`
        CREATE TRIGGER check_lease_exists
            BEFORE INSERT 
            ON leases
            FOR EACH ROW
        EXECUTE PROCEDURE check_lease_exists();
    `;
};

exports.down = async function (sql) {
  await sql`
        DROP TRIGGER IF EXISTS check_lease_exists ON leases;
    `;

  await sql`
        DROP FUNCTION IF EXISTS check_lease_exists;
    `;
};
