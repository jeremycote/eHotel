exports.up = async function (sql) {
  await sql`
        DROP TABLE IF EXISTS hotel_chains CASCADE;
    `;

  await sql`
        CREATE TABLE hotel_chains
        (
            chain_id serial primary key,
            name     VARCHAR(255) NOT NULL,
            address  VARCHAR(255) NOT NULL
        );
    `;

  await sql`
        DROP TABLE IF EXISTS chain_phone_numbers CASCADE;
    `;

  await sql`
        CREATE TABLE chain_phone_numbers
        (
            phone_number VARCHAR(20) primary key,
            chain_id INTEGER references hotel_chains (chain_id) on delete restrict not null
        );
    `;

  await sql`
        DROP TABLE IF EXISTS chain_emails CASCADE;
    `;

  await sql`
        CREATE TABLE chain_emails
        (
            email VARCHAR(320) primary key,
            chain_id INTEGER references hotel_chains (chain_id) on delete restrict not null
        );
    `;

  await sql`
        DROP TABLE IF EXISTS categories CASCADE;
    `;

  await sql`
        CREATE TABLE categories
        (
            category_id serial primary key,
            name     VARCHAR(255) NOT NULL
        );
    `;

  await sql`
        DROP TABLE IF EXISTS hotels CASCADE;
    `;

  await sql`
        CREATE TABLE hotels
        (
            hotel_id serial primary key,
            chain_id INTEGER references hotel_chains (chain_id) on delete restrict not null,
            name     VARCHAR(255) NOT NULL,
            stars    INTEGER NOT NULL CHECK (stars between 0 and 5),
            address  VARCHAR(255) NOT NULL,
            zone     VARCHAR(50) NOT NULL
        );
    `;

  await sql`
        DROP TABLE IF EXISTS hotel_categories CASCADE;
    `;

  await sql`
        CREATE TABLE hotel_categories
        (
            hotel_category_id serial primary key,
            category_id INTEGER references categories (category_id) on delete restrict not null,
            hotel_id INTEGER references hotels (hotel_id) on delete restrict not null
        );
    `;

  await sql`
        DROP TABLE IF EXISTS hotel_phone_numbers CASCADE;
    `;

  await sql`
        CREATE TABLE hotel_phone_numbers
        (
            phone_number VARCHAR(20) primary key,
            hotel_id INTEGER references hotels (hotel_id) on delete restrict not null
        );`;

  await sql`
        DROP TABLE IF EXISTS hotel_emails CASCADE;
    `;

  await sql`
        CREATE TABLE hotel_emails
        (
            email VARCHAR(320) primary key,
            hotel_id INTEGER references hotels (hotel_id) on delete restrict not null
        );
    `;

  await sql`
        DROP TABLE IF EXISTS rooms CASCADE;
    `;

  await sql`
        CREATE TABLE rooms
        (
            room_id serial primary key,
            hotel_id INTEGER references hotels (hotel_id) on delete restrict not null,
            price    INT NOT NULL CHECK (price >= 0),
            capacity INT NOT NULL CHECK (capacity >= 0),
            extendable BOOLEAN NOT NULL DEFAULT false,
            damages  VARCHAR,
            view VARCHAR(50) NOT NULL
        );
    `;

  await sql`
        DROP TABLE IF EXISTS amenities CASCADE;
    `;

  await sql`
        CREATE TABLE amenities
        (
            amenity_id serial primary key,
            name VARCHAR(50) NOT NULL
        );`;

  await sql`
        DROP TABLE IF EXISTS room_amenities CASCADE;
    `;

  await sql`
        CREATE TABLE room_amenities
        (
            room_amenity_id serial primary key,
            room_id INTEGER references rooms (room_id) on delete restrict not null,
            amenity_id INTEGER references amenities (amenity_id) on delete restrict not null
        );
    `;

  await sql`
        DROP TABLE IF EXISTS employees CASCADE;
    `;

  await sql`
        CREATE TABLE employees
        (
            employee_id serial primary key,
            hotel_id INTEGER references hotels (hotel_id) on delete restrict not null,
            name    VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            nas VARCHAR(50) NOT NULL
        );
    `;

  await sql`
        DROP TABLE IF EXISTS employee_roles CASCADE;
    `;

  await sql`
        CREATE TABLE employee_roles
        (
            role_id serial primary key,
            employee_id INTEGER references employees (employee_id) on delete restrict not null,
            role VARCHAR(50) NOT NULL
        );
    `;

  await sql`
        DROP TABLE IF EXISTS clients CASCADE;
    `;

  await sql`
        CREATE TABLE clients
        (
            client_id serial primary key,
            name    VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            nas VARCHAR(50) NOT NULL,
            email VARCHAR(320) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            created_at timestamp not null default(now())
        );
    `;

  await sql`
        DROP TABLE IF EXISTS reservations CASCADE;
    `;

  await sql`
        CREATE TABLE reservations
        (
            reservation_id serial primary key,
            client_id INTEGER references clients (client_id) on delete restrict not null,
            room_id INTEGER references rooms (room_id) on delete restrict not null,
            price    INT NOT NULL CHECK (price >= 0),
            archived BOOLEAN NOT NULL DEFAULT false,
            number_guests INT NOT NULL
        );
    `;

  await sql`
        DROP TABLE IF EXISTS leases CASCADE;
    `;

  await sql`
        CREATE TABLE leases
        (
            lease_id serial primary key,
            reservation_id INTEGER references reservations (reservation_id) on delete restrict not null,
            employee_id INTEGER references employees (employee_id) on delete restrict not null,
            paid BOOLEAN NOT NULL DEFAULT false,
            archived BOOLEAN NOT NULL DEFAULT false
        );
    `;
};

exports.down = async function (sql) {
  await sql`
        DROP TABLE IF EXISTS hotel_chains CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS chain_phone_numbers CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS chain_emails CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS categories CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS hotels CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS hotel_categories CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS hotel_phone_numbers CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS hotel_emails CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS rooms CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS amenities CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS room_amenities CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS employees CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS employee_roles CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS clients CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS reservations CASCADE;
    `;

  await sql`
        DROP TABLE IF EXISTS leases CASCADE;
    `;
};
