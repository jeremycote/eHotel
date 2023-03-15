exports.up = async function (sql) {
  // example
  // await sql`
  //     DROP TABLE IF EXISTS hotel_chains CASCADE;
  // `;
  await sql`
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `;

  await sql`
        INSERT INTO hotel_chains (name, address) VALUES
            ('Marriott International', '7750 Wisconsin Ave. Bethesda, MD 20814'),
            ('Hilton Hotels', '7930 Jones Branch Drive McLean, Virginia 22102'),
            ('Whyndham Hotel Group', '22 Sylvan Way, Parsippany, NJ 07054, United States'),
            ('Accor Group', '2, rue de la Mare-Neuve, 91021 Evry Cedex, France'),
            ('Best Western', ' 6201 N. 24th Parkway Phoenix, AZ 85016');
    `;

  await sql`
        INSERT INTO zones (name) VALUES
          ('NA'), ('EU'), ('AS');
  `;

  await sql`
        INSERT INTO hotels (chain_id, name, stars, address, zone_id) VALUES
            (1, 'The Ritz-Carlton New York', 5, '25 W 28th St, New York, NY 10001, United States', 1),
            (1, 'The Madrid EDITION', 4, 'Pl. de Celenque, 2, 28013 Madrid, Spain', 2),
            (1, 'Renaissance Paris Republique Hotel', 4, '40 Rue Rene Boulanger Paris, France 75010', 2),
            (1, 'Paris Marriott Opera Ambassador Hotel', 3, '16 Boulevard Haussmann Paris, France 75009', 2),
            (1, 'Four Points by Sheraton Vaughan', 2, '3400 Steeles Avenue West Vaughan/Toronto, Ontario L4K 1A2', 1),
            (1, 'Residence Inn Mississauga-Airport Corporate Centre West', 3, '5070 Creekbank Rd. Mississauga, Ontario L4W 5R2', 1),
            (1, 'The Westin Josun Seoul', 5, '106 Sogong-ro, Jung-gu Seoul, South Korea 04533', 3),
            (1, 'Four Points by Sheraton Josun, Seoul Station', 3, '366, Hangang-daero, Youngsan-gu Seoul, South Korea 04323', 3),
            (1, 'Four Points by Sheraton Seoul, Gangnam', 4, '203, Dosan-daero, Gangnam-gu Seoul, South Korea 06026', 3),
            (1, 'Josun Palace, a Luxury Collection Hotel, Seoul Gangnam', 4, '231 Teheran-ro, Gangnam-gu Seoul, South Korea', 3),
            (2, 'The Hilton Club - New York', 4 ,'1335 Avenue of the Americas ,37th FL, New York, New York, 10019, USA', 1),
            (2, 'Hilton Garden Inn New York/Midtown Park Ave', 3, '45 East 33rd Street, New York, New York, 10016, USA', 1),
            (2, 'Homewood Suites by Hilton Seattle-Issaquah', 3, '1484 Hyla Avenue NW, Issaquah, Washington, 98027, USA', 1),
            (2, 'Niepce Paris Hotel, Curio Collection by Hilton', 4, '4 rue Niepce, Paris, 75014, France', 2),
            (2, 'DoubleTree by Hilton Royal Parc Soestduinen', 3, 'Van Weerden Poelmanweg 4-6, Soestduinen, 3768 MN, Netherlands', 2),
            (2, 'Home2 Suites by Hilton Huntsville', 1, '159 Howland Drive, Huntsville, Ontario, P1H 2P7, Canada', 1),
            (2, 'Canopy by Hilton Toronto Yorkville', 4, '387 Bloor Street East, Toronto, Ontario, M4W 1H7, Canada', 1),
            (2, 'Conrad Tokyo', 5, '105-7337, Tokyo, 1-9-1 Higashi-Shinbashi, Minato-ku, Japan', 3),
            (2, 'Hilton Niseko Village', 4, '048-1592, Abuta-gun, Niseko-cho, Higashiyama Onsen, Japan', 3);
    `;

  await sql`
    INSERT INTO hotel_images (hotel_id, url) VALUES
        (1, 'https://unsplash.it/400/400'),
        (1, 'https://unsplash.it/400/400'),
        (2, 'https://unsplash.it/400/400'),
        (3, 'https://unsplash.it/400/400');
  `;

  await sql`
        INSERT INTO amenities (name) VALUES
            ('Double Size Bed'),
            ('Queen Size Bed'),
            ('King Size Bed'),
            ('Twin Size Bed'),
            ('Mini Bar'),
            ('Coffee Machine');
    `;

  await sql`
    INSERT INTO categories (name) VALUES
        ('Business'),
        ('Beach'),
        ('Downtown'),
        ('Popular'),
        ('Family Friendly'),
        ('All-Inclusive'),
        ('Luxury'),
        ('Cottage');
    `;

  await sql`
    INSERT INTO room_types (name) VALUES
        ('Classic'),
        ('Suite'),
        ('Presidential Suite');
    `;

  await sql`
    INSERT INTO chain_emails (email, chain_id) VALUES
        ('contact@hilton.com', 1);
    `;

  await sql`
    INSERT INTO chain_phone_numbers (phone_number, chain_id) VALUES
        ('613 123-1234', 1);
    `;

  await sql`
    INSERT INTO users (name, address, nas, email, phone_number, created_at, password) VALUES
        ('Art Festival', '300 example rd', '11111111', 'art@example.com', '613 123-1234', '2020-12-20', crypt('hello', gen_salt('bf'))),
        ('Voyageur Yogourt', '30 alder rd', '1141611', 'yogourt@example.com', '613 123-2234', '2019-12-20', crypt('hello', gen_salt('bf')));
    `;

  await sql`
    INSERT INTO employees (employee_id, hotel_id) VALUES
        (1, 1);
    `;

  await sql`
    INSERT INTO employee_roles (employee_id, role) VALUES
        (1, 'Manager');
    `;

  await sql`
    INSERT INTO hotel_categories (category_id, hotel_id) VALUES
        (1,1),
        (1,8);
    `;

  await sql`
    INSERT INTO hotel_emails (email, hotel_id) VALUES
        ('example@example.com', 1);
    `;

  await sql`
    INSERT INTO hotel_phone_numbers (phone_number, hotel_id) VALUES
        ('613 123-1234', 1);
    `;

  await sql`
    INSERT INTO rooms (hotel_id, price, capacity, extendable, damages, view, room_type_id, area) VALUES
        (1, 100, 2, False, NULL, 'Ocean View', 1, 20),
        (1, 110, 2, False, NULL, 'Ocean View', 1, 30),
        (1, 130, 2, False, NULL, 'Ocean View', 2, 20),
        (1, 150, 2, False, NULL, 'Ocean View', 2, 30),
        (1, 250, 4, False, TRUE, 'Ocean View', 3, 40),
        (1, 270, 4, False, TRUE, 'Ocean View', 3, 10),
        (8, 270, 4, False, TRUE, 'Ocean View', 3, 7);
    `;

  await sql`
    INSERT INTO reservations (user_id, room_id, price, archived, number_guests, start_date) VALUES
        (1, 1, 100, False, 1, '2023-03-08');
    `;

  await sql`
    INSERT INTO leases (reservation_id, employee_id, paid, archived) VALUES
        (1, 1, True, False);
    `;

  await sql`
    INSERT INTO room_amenities (room_id, amenity_id) VALUES
        (1, 1),
        (2, 1);
    `;
};

exports.down = async function (sql) {
  // example
  // await sql`
  //     DROP TABLE IF EXISTS hotel_chains CASCADE;
  // `;
};
