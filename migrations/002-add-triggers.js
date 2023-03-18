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

  await sql`
        CREATE OR REPLACE FUNCTION check_reservation_exists()
            RETURNS TRIGGER
            LANGUAGE PLPGSQL
        AS
        $$
        BEGIN
            if not exists (
                select reservation_id
                from reservations r
                where daterange(r.start_date, r.end_date) && daterange(NEW.start_date, NEW.end_date) and r.room_id = NEW.room_id
                ) then
            RETURN NEW;
            end if;
            raise exception 'RESERVATION ALREADY EXISTS FOR THE SAME DATES AND ROOMS';
        END;
        $$
    `;

  await sql`
        CREATE TRIGGER check_reservation_exists
            BEFORE INSERT or UPDATE 
            ON reservations
            FOR EACH ROW
        EXECUTE PROCEDURE check_reservation_exists();
    `;
};

exports.down = async function (sql) {
  await sql`
        DROP TRIGGER IF EXISTS check_lease_exists ON leases;
    `;

  await sql`
        DROP FUNCTION IF EXISTS check_lease_exists;
    `;

  await sql`
        DROP TRIGGER IF EXISTS check_reservation_exists ON reservations;
    `;

  await sql`
        DROP FUNCTION IF EXISTS check_reservation_exists;
    `;
};
