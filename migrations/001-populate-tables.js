exports.up = async function (sql) {
  // example
  // await sql`
  //     DROP TABLE IF EXISTS hotel_chains CASCADE;
  // `;

  await sql`
        INSERT INTO hotel_chains VALUES
            (0, 'Marriott International', '7750 Wisconsin Ave. Bethesda, MD 20814'),
            (1, 'Hilton Hotels', '7930 Jones Branch Drive McLean, Virginia 22102'),
            (2, 'Whyndham Hotel Group', '22 Sylvan Way, Parsippany, NJ 07054, United States'),
            (3, 'Accor Group', '2, rue de la Mare-Neuve, 91021 Evry Cedex, France'),
            (4, 'Best Western', ' 6201 N. 24th Parkway Phoenix, AZ 85016');
    `;

  await sql`
        INSERT INTO hotels (chain_id, name, stars, address, zone) VALUES
            (0, 'The Ritz-Carlton New York', 5, '25 W 28th St, New York, NY 10001, United States', 'NA'),
            (0, 'The Madrid EDITION', 4, 'Pl. de Celenque, 2, 28013 Madrid, Spain', 'EU'),
            (0, 'Renaissance Paris Republique Hotel', 4, '40 Rue Rene Boulanger Paris, France 75010', 'EU'),
            (0, 'Paris Marriott Opera Ambassador Hotel', 3, '16 Boulevard Haussmann Paris, France 75009', 'EU'),
            (0, 'Four Points by Sheraton Vaughan', 2, '3400 Steeles Avenue West Vaughan/Toronto, Ontario L4K 1A2', 'NA'),
            (0, 'Residence Inn Mississauga-Airport Corporate Centre West', 3, '5070 Creekbank Rd. Mississauga, Ontario L4W 5R2', 'NA'),
            (0, 'The Westin Josun Seoul', 5, '106 Sogong-ro, Jung-gu Seoul, South Korea 04533', 'AS'),
            (0, 'Four Points by Sheraton Josun, Seoul Station', 3, '366, Hangang-daero, Youngsan-gu Seoul, South Korea 04323', 'AS'),
            (0, 'Four Points by Sheraton Seoul, Gangnam', 4, '203, Dosan-daero, Gangnam-gu Seoul, South Korea 06026', 'AS'),
            (0, 'Josun Palace, a Luxury Collection Hotel, Seoul Gangnam', 4, '231 Teheran-ro, Gangnam-gu Seoul, South Korea', 'AS'),
            (1, 'The Hilton Club - New York', 4 ,'1335 Avenue of the Americas ,37th FL, New York, New York, 10019, USA', 'NA'),
            (1, 'Hilton Garden Inn New York/Midtown Park Ave', 3, '45 East 33rd Street, New York, New York, 10016, USA', 'NA'),
            (1, 'Homewood Suites by Hilton Seattle-Issaquah', 3, '1484 Hyla Avenue NW, Issaquah, Washington, 98027, USA', 'NA'),
            (1, 'Niepce Paris Hotel, Curio Collection by Hilton', 4, '4 rue Niepce, Paris, 75014, France', 'EU'),
            (1, 'DoubleTree by Hilton Royal Parc Soestduinen', 3, 'Van Weerden Poelmanweg 4-6, Soestduinen, 3768 MN, Netherlands', 'EU'),
            (1, 'Home2 Suites by Hilton Huntsville', 1, '159 Howland Drive, Huntsville, Ontario, P1H 2P7, Canada', 'NA'),
            (1, 'Canopy by Hilton Toronto Yorkville', 4, '387 Bloor Street East, Toronto, Ontario, M4W 1H7, Canada', 'NA'),
            (1, 'Conrad Tokyo', 5, '105-7337, Tokyo, 1-9-1 Higashi-Shinbashi, Minato-ku, Japan', 'AS'),
            (1, 'Hilton Niseko Village', 4, '048-1592, Abuta-gun, Niseko-cho, Higashiyama Onsen, Japan', 'AS');
    `;
};

exports.down = async function (sql) {
  // example
  // await sql`
  //     DROP TABLE IF EXISTS hotel_chains CASCADE;
  // `;
};
