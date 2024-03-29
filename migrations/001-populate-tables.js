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
            (2, 'Hilton Niseko Village', 4, '048-1592, Abuta-gun, Niseko-cho, Higashiyama Onsen, Japan', 3),
            (2, 'Hilton Lac-Leamy', 4, '3 Boulevard du Casino, Gatineau, Quebec, J8Y 6X4, Canada', 1),
            (3, 'Microtel Inn & Suites by Wyndham Albertville', 2, '220 Highway 75 North, Albertville, Alabama, 35950, USA', 1),
            (3, 'La Quinta Inn & Suites by Wyndham Anchorage Airport', 2, '3501 Minnesota Drive, Anchorage, Alaska, 99503, USA', 1),
            (3, 'Days Inn & Suites by Wyndham Pine Bluff', 2, '406 North Blake Street, Pine Bluff, Arkansas, 71601, USA', 1),
            (3, 'Wyndham Garden Nagaizumi', 3, '646 Higashino, Nagaizumi, Sunto District, Shizuoka 411-0931, Japan', 3),
            (3, 'Ramada by Wyndham Incheon', 4, '36 Soraeyeok-ro, Namdong-gu, Incheon, South Korea', 3),
            (3, 'Ramada Hotel and Suites Seoul Namdaemun', 4, '27 Chilpae-ro, Jung-gu, Seoul, South Korea', 3),
            (3, 'Ramada by Wyndham Seoul Dongdaemun', 4, '275-3 Euljiro 5(o)-ga, Jung-gu, Seoul, South Korea', 3),
            (3, 'Wingate by Wyndham Kanata West Ottawa', 3, '8600 Campeau Drive, Kanata, Ontario, K2T 0N7, Canada', 1),
            (3, 'Ramada by Wyndham Ottawa On The Rideau', 2, '2259 Prince of Wales Drive, Ottawa, Ontario, K2E 6Z8, Canada', 1),
            (3, 'Microtel Inn & Suites by Wyndham Mont Tremblant', 3, '235 Montee Ryan, Mont-Tremblant, Quebec, J8E 1S3, Canada', 1),
            (4, 'Fairmont Hotel Macdonald', 4, '10065 100 Street NW, Edmonton, Alberta, T5J 0N6, Canada', 1),
            (4, 'Fairmont Palliser', 4, '133 9 Avenue SW, Calgary, Alberta, T2P 2M3, Canada', 1),
            (4, 'Fairmont Banff Springs', 4, '405 Spray Avenue, Banff, Alberta, T1L 1J4, Canada', 1),
            (4, 'Novotel Toronto Vaughan', 3, '200 Bass Pro Mills Drive, Vaughan, Ontario, L4K 0B9, Canada', 1),
            (4, 'Pullman Tokyo Tamachi', 5, '3 Chome-1-21 Shibaura, Minato City, Tokyo 108-0023, Japan', 3),
            (4, 'Mercure Tokyo Ginza', 4, '2 Chome-9-4 Ginza, Chuo City, Tokyo 104-0061, Japan', 3),
            (4, 'ibis Styles Tokyo Bay', 3, '2 Chome-1-1 Urayasu, Hinode, Chiba 279-0013, Japan', 3),
            (4, 'ibis Ambassador Busan City Centre', 3, '777 Jungang-daero, Busanjin-gu, Busan, South Korea', 3),
            (4, 'ibis budget Ambassador Busan Haeundae', 2, '8 Haeundaehaebyeon-ro 209beon-gi, Haeundae-gu, Busan, South Korea', 3),
            (4, 'Fairmont Dallas', 4, '1717 North Akard Street, Dallas, Texas, 75201, USA', 1),
            (5, 'Best Western Hotel Arabellapark Muenchen', 3, 'Arabellastrasse 15, 81925 München, Germany', 2),
            (5, 'Best Western Plus Universal Inn', 3, '5618 Vineland Road, Orlando, Florida 32819, USA', 1),
            (5, 'Best Western Cabrillo Garden Inn', 2, '840 A Street, San Diego, California 92101, USA', 1),
            (5, 'Best Western Parkway Hotel Toronto North', 3, '600 Highway 7, Richmond Hill, ON L4B 1B2, Canada', 1),
            (5, 'Best Western King George Inn & Suites', 3, '8033 King George Blvd, Surrey, British-Colombia V3W 5B4, Canada', 1),
            (5, 'Hotel L Horset Opera, BW Premier Collection', 4, '18 Rue d Antin, Paris, 75002, France', 2),
            (5, 'Best Western Alba Hotel', 4, '41 Av. Jean Médecin, Nice, 06000, France', 2),
            (5, 'Best Western Saint Antoine', 3, '4 Rue de l Ancienne Prefecture, Lyon, 69002, France', 2),
            (5, 'Best Western Premier Sonasea Phu Quoc', 5, 'Duong Bao Hamlet, Phu Quoc, 920000, Vietnam', 3),
            (5, 'Best Western Premier Sapphire Halong', 5, 'S2 Building, Lot HH05, Ben Doan High Class Area, Hong Gai Ward, Ha Long, 200000, Vietnam', 3);
    `;

  // await sql`
  //   INSERT INTO hotel_images (hotel_id, url) VALUES
  //       (1, 'https://unsplash.com/photos/Yrxr3bsPdS0/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgwMTE0NTUz'),
  //       (1, 'https://unsplash.com/photos/-27u_GzlAFw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MTB8fGhvdGVsfGVufDB8fHx8MTY4MDA4ODQ1Ng'),
  //       (2, 'https://unsplash.com/photos/lw3Lqe2K7xc/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mjh8fGhvdGVsfGVufDB8fHx8MTY4MDA0NTAyNA'),
  //       (3, 'https://unsplash.com/photos/lTrbjFd8Iwo/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MzV8fGhvdGVsfGVufDB8fHx8MTY4MDA0NTAyNA'),
  //       (3, 'https://unsplash.com/photos/2LzqR50_NTw/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgwMTE1Nzgx&force=true');
  // `;

  // Insert a filler image from unsplash if no image was specified
  await sql`
  INSERT INTO hotel_images (hotel_id, url)
    SELECT hotel_id, 'https://picsum.photos/seed/' || hotel_id FROM hotels WHERE hotel_id NOT IN (SELECT hotel_id FROM hotel_images);
  `;
  await sql`
    INSERT INTO hotel_images (hotel_id, url)
    SELECT hotel_id, 'https://picsum.photos/seed/' || 'i2' || hotel_id FROM hotels GROUP BY hotel_id HAVING COUNT(hotel_id) < 2;
  `;
  await sql`
    INSERT INTO hotel_images (hotel_id, url)
    SELECT hotel_id, 'https://picsum.photos/seed/' || 'i3' || hotel_id FROM hotels GROUP BY hotel_id HAVING COUNT(hotel_id) < 3;
  `;
  await sql`
    INSERT INTO hotel_images (hotel_id, url)
    SELECT hotel_id, 'https://picsum.photos/seed/' || 'i4' || hotel_id FROM hotels GROUP BY hotel_id HAVING COUNT(hotel_id) < 4;
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
        ('contact@marriott.com', 1),
        ('contact@hilton.com', 2),
        ('contact@whyndham.com', 3),
        ('contact@accor.com', 4),
        ('contact@bestwestern.com', 5);
    `;

  await sql`
    INSERT INTO chain_phone_numbers (phone_number, chain_id) VALUES
        ('240 123-1234', 1),
        ('703 123-1234', 2),
        ('973 123-1234', 3),
        ('303 123-1234', 4),
        ('506 123-1234', 5);
    `;

  await sql`
    INSERT INTO users (name, address, nas, email, phone_number, created_at, password) VALUES
        ('Employee', '300 example rd', '11111111', 'employee@hotel.com', '613 123-1234', '2020-12-20', crypt('employee', gen_salt('bf'))),
        ('Employee 2', '300 example rd', '11111111', 'employee2@hotel.com', '613 123-1234', '2020-12-20', crypt('employee', gen_salt('bf'))),
        ('Client', '30 alder rd', '1141611', 'client@hotel.com', '613 123-2234', '2019-12-20', crypt('client', gen_salt('bf'))),
        ('Client 2', '30 alder rd', '1141611', 'client2@hotel.com', '613 123-2234', '2019-12-20', crypt('client', gen_salt('bf')))
  `;

  await sql`
    INSERT INTO employees (employee_id, hotel_id) VALUES
        (1, 1),
        (2, 2);
    `;

  await sql`
    INSERT INTO employee_roles (employee_id, role) VALUES
        (1, 'Manager'),
        (2, 'Manager');
    `;

  await sql`
    INSERT INTO hotel_categories (category_id, hotel_id) VALUES
        (1,1),
        (1,4),
        (1,7),
        (1,18),
        (1,10),
        (1,46),
        (1,24),
        (1,32),
        (2,1),
        (2,11),
        (2,13),
        (2,49),
        (2,35),
        (2,44),
        (2,15),
        (2,37),
        (2,26),
        (3,22),
        (3,9),
        (3,11),
        (3,3),
        (3,18),
        (3,29),
        (3,43),
        (3,22),
        (3,45),
        (3,40),
        (3,49),
        (3,19),
        (4,22),
        (4,10),
        (4,11),
        (4,37),
        (4,6),
        (4,49),
        (4,50),
        (4,26),
        (4,23),
        (5,13),
        (5,28),
        (5,8),
        (5,25),
        (5,19),
        (5,3),
        (6,39),
        (6,17),
        (6,37),
        (6,33),
        (6,22),
        (6,5),
        (6,20),
        (6,11),
        (6,30),
        (6,41),
        (6,26),
        (6,42),
        (6,49),
        (7,29),
        (7,16),
        (7,37),
        (7,21),
        (7,27),
        (7,34),
        (7,8),
        (8,48),
        (8,49),
        (8,34),
        (8,14),
        (8,12),
        (8,31),
        (8,36),
        (8,38),
        (8,21),
        (8,47),
        (8,48),
        (8,2);
    `;

  await sql`
    INSERT INTO hotel_emails (email, hotel_id) VALUES
        ('contact@ritzcarletonnycentralpark.com', 1),
        ('contact@madridedition.com', 2),
        ('contact@renaissanceparisrepublique.com', 3),
        ('contact@parismarriotoperaambassador.com', 4),
        ('contact@fourpointssheratonvaughan.com', 5),
        ('contact@residenceinnmarriotmississaugaairport.com', 6),
        ('contact@westinjosunseoul.com', 7),
        ('contact@fourpointssheratonjosunseoul.com', 8),
        ('contact@fourpointssheratonseoulgangnam.com', 9),
        ('contact@josunpalace.com', 10),
        ('contact@hiltonclubny.com', 11),
        ('contact@hiltongardeninnnymidtownpark.com', 12),
        ('contact@homewoodsuiteshiltonseattleissaquah.com', 13),
        ('contact@niepceparishotelhilton.com', 14),
        ('contact@doubletreehiltonroyalsoestduinen.com', 15),
        ('contact@home2suiteshiltonhuntsvilleresearchpark.com', 16),
        ('contact@canopyhiltontorontoyorkville.com', 17),
        ('contact@conradtokyo.com', 18),
        ('contact@hiltonnisekovillage.com', 19),
        ('contact@hiltonlacleamy.com', 20),
        ('contact@microtelinnsuiteswyndhamalbertville.com', 21),
        ('contact@laquintaiinsuiteswyndhamanchorageairport.com', 22),
        ('contact@daysinnsuiteswyndhampinebluff.com', 23),
        ('contact@wyndhamgardennagaizumi.com', 24),
        ('contact@ramadawyndhamincheon.com', 25),
        ('contact@ramadahotelsuitesseolnamdaemun.com', 26),
        ('contact@ramadawyndhamseouldongdaemun.com', 27),
        ('contact@wingatewindhamkanatawestottawa.com', 28),
        ('contact@ramadawyndhamottawarideau.com', 29),
        ('contact@microtelinnsuiteswindhyamtremblant.com', 30),
        ('contact@fairmonhotelmacdonald.com', 31),
        ('contact@fairmontpalliser.com', 32),
        ('contact@fairmonbanffsprings.com', 33),
        ('contact@novoteltorontovaughan.com', 34),
        ('contact@pullmantokyotamachi.com', 35),
        ('contact@mercuretokyoginza.com', 36),
        ('contact@ibisstylestokyobay.com', 37),
        ('contact@ibisambassadorbusancitycentre.com', 38),
        ('contact@ibisbudgetambassadorbusanhaeundae.com', 39),
        ('contact@farimontdallas.com', 40),
        ('contact@bwarabellaparkmunchen.com', 41),
        ('contact@bwplusuniversalinn.com', 42),
        ('contact@bwcabrillogardeninn.com', 43),
        ('contact@bwparkwaytorontonorth.com', 44),
        ('contact@bwkinggeorgeinn.com', 45),
        ('contact@bwhorsetopera.com', 46),
        ('contact@bwalbanice.com', 47),
        ('contact@bwsaintantoine.com', 48),
        ('contact@bwpremiersonaseaphuquoc.com', 49),
        ('contact@bwpremiersapphirehalong.com', 50);
    `;

  await sql`
    INSERT INTO hotel_phone_numbers (phone_number, hotel_id) VALUES
        ('212 308-9100', 1),
        ('919 54-54-20', 2),
        ('1 71 18 20 95', 3),
        ('1 44 83 40 40', 4),
        ('905 760-2120', 5),
        ('905 602-7777', 6),
        ('2-771-0500', 7),
        ('2-6070-7000', 8),
        ('2-2160-8900', 9),
        ('2-727-7200', 10),
        ('646 459-6500', 11),
        ('212 755-1108', 12),
        ('425 391-4000', 13),
        ('1 83 75 69 20', 14),
        ('35 603 8383', 15),
        ('256 971-1667', 16),
        ('406 921 3333', 17),
        ('3-6388-8000', 18),
        ('136-44-1111', 19),
        ('819 790-6444', 20),
        ('256 894-4000', 21),
        ('907 276-8884', 22),
        ('870 619-4318', 23),
        ('55-989-0100', 24),
        ('32-460-1100', 25),
        ('2-775-7000', 26),
        ('2-2276-3500', 27),
        ('613 321-0063', 28),
        ('613 288-3500', 29),
        ('819 717-2700', 30),
        ('780 424-5181', 31),
        ('403 262-1234', 32),
        ('403 762-2211', 33),
        ('905 660-0212', 34),
        ('3-6400-5855', 35),
        ('3-4335-1111', 36),
        ('47-381-6775', 37),
        ('51-930-1100', 38),
        ('51-901-1100', 39),
        ('214 720-2020', 40),
        ('89 380-3360', 41),
        ('407 226-9119', 42),
        ('619 234-8477', 43),
        ('905 881-2600', 44),
        ('604 502-9000', 45),
        ('1 44 71 87 00', 46),
        ('4 93 88 02 88', 47),
        ('4 78 92 91 91', 48),
        ('297 6279 999', 49),
        ('203 3993 399', 50);
    `;

  await sql`
    INSERT INTO rooms (hotel_id, price, capacity, extendable, damages, view, room_type_id, area) VALUES
        (1, 150, 1, False, NULL, 'Ocean View', 1, 20),
        (1, 160, 2, False, NULL, 'Ocean View', 1, 30),
        (1, 180, 3, False, NULL, 'Mountain View', 2, 20),
        (1, 200, 2, False, NULL, 'Ocean View', 2, 30),
        (1, 300, 4, False, TRUE, 'Ocean View', 3, 40),
        (1, 280, 6, False, TRUE, 'Ocean View', 3, 10),
        (2, 130, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (2, 140, 3, False, NULL, 'Ocean View', 1, 32),
        (2, 160, 2, TRUE, NULL, 'Ocean View', 2, 25),
        (2, 170, 4, TRUE, NULL, 'Mountain View', 2, 30),
        (2, 250, 5, TRUE, NULL, 'Mountain View', 3, 27),
        (3, 132, 1, False, NULL, 'Ocean View', 1, 22),
        (3, 142, 2, False, FALSE, 'Mountain View', 1, 35),
        (3, 164, 2, TRUE, TRUE, 'Ocean View', 2, 24),
        (3, 173, 4, TRUE, NULL, 'Ocean View', 2, 31),
        (3, 256, 5, TRUE, TRUE, 'Mountain View', 3, 29),
        (4, 101, 3, False, NULL, 'Mountain View', 1, 22),
        (4, 113, 2, False, FALSE, 'Mountain View', 1, 35),
        (4, 134, 1, TRUE, TRUE, 'Ocean View', 2, 24),
        (4, 157, 4, TRUE, NULL, 'Mountain View', 2, 31),
        (4, 157, 6, TRUE, NULL, 'Mountain View', 2, 41),
        (5, 90, 1, TRUE, NULL, 'Ocean View', 1, 20),
        (5, 102, 2, False, FALSE, 'Mountain View', 1, 30),
        (5, 123, 3, False, TRUE, 'Mountain View', 2, 22),
        (5, 135, 4, TRUE, NULL, 'Ocean View', 2, 33),
        (5, 135, 5, TRUE, NULL, 'Ocean View', 2, 33),
        (6, 103, 1, TRUE, NULL, 'Mountain View', 1, 23),
        (6, 103, 2, TRUE, NULL, 'Mountain View', 1, 23),
        (6, 114, 3, False, TRUE, 'Mountain View', 1, 34),
        (6, 136, 6, False, NULL, 'Ocean View', 2, 22),
        (6, 153, 4, TRUE, TRUE, 'Ocean View', 2, 30),
        (7, 153, 1, TRUE, NULL, 'Mountain View', 1, 22),
        (7, 165, 2, False, NULL, 'Ocean View', 1, 33),
        (7, 183, 4, TRUE, TRUE, 'Mountain View', 2, 22),
        (7, 202, 3, False, NULL, 'Mountain View', 2, 33),
        (7, 305, 5, False, TRUE, 'Ocean View', 3, 42),
        (7, 193, 4, TRUE, NULL, 'Ocean View', 3, 12),
        (8, 103, 1, TRUE, NULL, 'Mountain View', 1, 23),
        (8, 103, 2, TRUE, NULL, 'Mountain View', 1, 23),
        (8, 114, 3, False, NULL, 'Ocean View', 1, 36),
        (8, 135, 4, False, TRUE, 'Mountain View', 2, 24),
        (8, 158, 5, TRUE, TRUE, 'Ocean View', 2, 35),
        (9, 132, 1, TRUE, TRUE, 'Mountain View', 1, 21),
        (9, 144, 2, False, NULL, 'Ocean View', 1, 33),
        (9, 162, 3, False, TRUE, 'Mountain View', 2, 24),
        (9, 174, 4, TRUE, NULL, 'Mountain View', 2, 33),
        (9, 252, 5, False, NULL, 'Ocean View', 3, 22),
        (10, 132, 2, False, TRUE, 'Mountain View', 1, 20),
        (10, 142, 1, TRUE, TRUE, 'Mountain View', 1, 32),
        (10, 142, 2, TRUE, TRUE, 'Mountain View', 1, 32),
        (10, 164, 3, False, NULL, 'Ocean View', 2, 23),
        (10, 174, 4, TRUE, TRUE, 'Ocean View', 2, 34),
        (10, 255, 5, TRUE, NULL, 'Mountain View', 3, 25),
        (11, 125, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (11, 138, 2, False, TRUE, 'Mountain View', 1, 32),
        (11, 162, 3, TRUE, TRUE, 'Ocean View', 2, 26),
        (11, 174, 4, False, NULL, 'Mountain View', 2, 33),
        (11, 248, 5, False, NULL, 'Mountain View', 3, 20),
        (12, 100, 1, False, NULL, 'Mountain View', 1, 22),
        (12, 110, 2, False, FALSE, 'Ocean View', 1, 35),
        (12, 130, 3, TRUE, TRUE, 'Ocean View', 2, 24),
        (12, 150, 4, False, NULL, 'Mountain View', 2, 31),
        (12, 150, 6, False, NULL, 'Mountain View', 2, 31),
        (13, 102, 1, False, NULL, 'Ocean View', 1, 20),
        (13, 102, 2, False, NULL, 'Ocean View', 1, 20),
        (13, 114, 3, TRUE, NULL, 'Mountain View', 1, 30),
        (13, 132, 4, TRUE, TRUE, 'Mountain View', 2, 20),
        (13, 154, 5, TRUE, NULL, 'Mountain View', 2, 30),
        (14, 132, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (14, 143, 2, TRUE, NULL, 'Ocean View', 1, 32),
        (14, 164, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (14, 172, 4, False, NULL, 'Mountain View', 2, 30),
        (14, 253, 7, False, TRUE, 'Ocean View', 3, 27),
        (15, 103, 2, False, NULL, 'Mountain View', 1, 20),
        (15, 116, 1, False, NULL, 'Mountain View', 1, 35),
        (15, 116, 3, False, NULL, 'Mountain View', 1, 35),
        (15, 116, 4, False, NULL, 'Mountain View', 1, 35),
        (15, 133, 5, False, TRUE, 'Ocean View', 2, 25),
        (15, 156, 4, TRUE, NULL, 'Ocean View', 2, 30),
        (16, 80, 1, False, NULL, 'Ocean View', 1, 20),
        (16, 80, 2, False, NULL, 'Ocean View', 1, 20),
        (16, 92, 3, False, NULL, 'Mountain View', 1, 35),
        (16, 94, 4, False, NULL, 'Ocean View', 1, 20),
        (16, 102, 6, False, NULL, 'Mountain View', 1, 35),
        (17, 129, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (17, 138, 2, False, NULL, 'Mountain View', 1, 34),
        (17, 162, 3, TRUE, TRUE, 'Ocean View', 2, 22),
        (17, 174, 4, False, TRUE, 'Ocean View', 2, 33),
        (17, 245, 5, False, NULL, 'Ocean View', 3, 24),
        (18, 160, 1, TRUE, NULL, 'Ocean View', 1, 20),
        (18, 170, 2, False, NULL, 'Ocean View', 1, 30),
        (18, 190, 3, TRUE, TRUE, 'Mountain View', 2, 20),
        (18, 210, 4, TRUE, NULL, 'Ocean View', 2, 30),
        (18, 310, 5, False, TRUE, 'Mountain View', 3, 40),
        (18, 290, 7, TRUE, NULL, 'Mountain View', 3, 10),
        (19, 130, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (19, 140, 2, False, NULL, 'Ocean View', 1, 32),
        (19, 160, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (19, 170, 4, TRUE, NULL, 'Mountain View', 2, 30),
        (19, 250, 5, TRUE, NULL, 'Mountain View', 3, 27),
        (20, 135, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (20, 145, 2, False, NULL, 'Ocean View', 1, 30),
        (20, 165, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (20, 175, 4, TRUE, NULL, 'Mountain View', 2, 30),
        (20, 255, 5, False, TRUE, 'Ocean View', 3, 25),
        (21, 85, 1, TRUE, NULL, 'Ocean View', 1, 20),
        (21, 85, 2, TRUE, NULL, 'Ocean View', 1, 20),
        (21, 95, 3, False, TRUE, 'Ocean View', 1, 30),
        (21, 115, 4, TRUE, NULL, 'Mountain View', 2, 22),
        (21, 125, 5, False, NULL, 'Ocean View', 2, 33),
        (22, 95, 1, False, NULL, 'Ocean View', 1, 20),
        (22, 95, 2, False, NULL, 'Ocean View', 1, 20),
        (22, 105, 3, TRUE, False, 'Mountain View', 1, 30),
        (22, 125, 4, False, NULL, 'Mountain View', 2, 22),
        (22, 135, 5, TRUE, TRUE, 'Ocean View', 2, 33),
        (23, 90, 1, TRUE, NULL, 'Ocean View', 1, 20),
        (23, 90, 2, TRUE, NULL, 'Ocean View', 1, 20),
        (23, 100, 3, False, NULL, 'Ocean View', 1, 30),
        (23, 120, 4, TRUE, TRUE, 'Mountain View', 2, 20),
        (23, 130, 5, TRUE, NULL, 'Ocean View', 2, 30),
        (24, 100, 1, False, NULL, 'Mountain View', 1, 20),
        (24, 100, 2, False, NULL, 'Mountain View', 1, 20),
        (24, 110, 3, TRUE, NULL, 'Mountain View', 1, 35),
        (24, 130, 4, TRUE, TRUE, 'Ocean View', 2, 25),
        (24, 157, 5, False, TRUE, 'Ocean View', 2, 30),
        (25, 130, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (25, 130, 2, TRUE, TRUE, 'Mountain View', 1, 20),
        (25, 140, 3, False, NULL, 'Ocean View', 1, 32),
        (25, 160, 4, TRUE, NULL, 'Ocean View', 2, 25),
        (25, 170, 5, TRUE, NULL, 'Mountain View', 2, 30),
        (25, 250, 7, TRUE, NULL, 'Mountain View', 3, 27),
        (26, 135, 2, False, NULL, 'Ocean View', 1, 20),
        (26, 145, 3, False, NULL, 'Ocean View', 1, 30),
        (26, 165, 1, False, NULL, 'Mountain View', 2, 25),
        (26, 175, 4, TRUE, NULL, 'Mountain View', 2, 30),
        (26, 175, 5, TRUE, NULL, 'Mountain View', 2, 30),
        (26, 255, 2, False, NULL, 'Mountain View', 3, 25),
        (27, 132, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (27, 144, 2, False, NULL, 'Ocean View', 1, 35),
        (27, 162, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (27, 174, 4, TRUE, NULL, 'Ocean View', 2, 30),
        (27, 254, 5, False, TRUE, 'Ocean View', 3, 25),
        (28, 100, 1, False, NULL, 'Ocean View', 1, 25),
        (28, 100, 2, False, NULL, 'Ocean View', 1, 25),
        (28, 110, 3, TRUE, FALSE, 'Mountain View', 1, 35),
        (28, 135, 4, TRUE, FALSE, 'Mountain View', 2, 25),
        (28, 155, 5, TRUE, NULL, 'Mountain View', 2, 30),
        (29, 90, 1, TRUE, NULL, 'Ocean View', 1, 20),
        (29, 90, 2, TRUE, NULL, 'Ocean View', 1, 20),
        (29, 90, 3, TRUE, NULL, 'Ocean View', 1, 20),
        (29, 100, 4, TRUE, TRUE, 'Ocean View', 1, 30),
        (29, 125, 5, False, TRUE, 'Ocean View', 2, 20),
        (29, 135, 4, TRUE, NULL, 'Ocean View', 2, 30),
        (30, 100, 1, False, NULL, 'Mountain View', 1, 22),
        (30, 100, 2, False, NULL, 'Mountain View', 1, 22),
        (30, 110, 3, False, TRUE, 'Mountain View', 1, 35),
        (30, 135, 4, False, NULL, 'Mountain View', 2, 24),
        (30, 155, 5, False, NULL, 'Mountain View', 2, 31),
        (31, 130, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (31, 140, 2, False, NULL, 'Ocean View', 1, 32),
        (31, 160, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (31, 170, 4, TRUE, NULL, 'Mountain View', 2, 30),
        (31, 250, 5, TRUE, NULL, 'Mountain View', 3, 27),
        (32, 135, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (32, 145, 2, TRUE, TRUE, 'Ocean View', 1, 30),
        (32, 165, 3, TRUE, NULL, 'Mountain View', 2, 25),
        (32, 175, 4, TRUE, TRUE, 'Ocean View', 2, 30),
        (32, 255, 5, TRUE, NULL, 'Mountain View', 3, 28),
        (33, 132, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (33, 143, 2, False, NULL, 'Ocean View', 1, 32),
        (33, 164, 3, False, TRUE, 'Ocean View', 2, 25),
        (33, 172, 4, False, TRUE, 'Mountain View', 2, 30),
        (33, 252, 5, TRUE, NULL, 'Mountain View', 3, 27),
        (34, 105, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (34, 115, 2, TRUE, TRUE, 'Ocean View', 1, 35),
        (34, 135, 3, False, TRUE, 'Mountain View', 2, 25),
        (34, 155, 4, False, NULL, 'Mountain View', 2, 30),
        (34, 155, 5, False, NULL, 'Mountain View', 2, 30),
        (35, 150, 1, False, NULL, 'Ocean View', 1, 20),
        (35, 150, 2, False, NULL, 'Ocean View', 1, 20),
        (35, 160, 3, False, NULL, 'Ocean View', 1, 30),
        (35, 180, 4, False, NULL, 'Mountain View', 2, 20),
        (35, 200, 5, False, NULL, 'Ocean View', 2, 30),
        (35, 300, 6, False, TRUE, 'Ocean View', 3, 40),
        (35, 280, 7, False, TRUE, 'Ocean View', 3, 10),
        (36, 135, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (36, 145, 2, False, NULL, 'Ocean View', 1, 32),
        (36, 165, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (36, 175, 4, False, TRUE, 'Ocean View', 2, 30),
        (36, 255, 5, False, NULL, 'Mountain View', 3, 27),
        (37, 100, 1, False, NULL, 'Ocean View', 1, 25),
        (37, 130, 6, TRUE, TRUE, 'Ocean View', 2, 25),
        (37, 115, 2, TRUE, TRUE, 'Ocean View', 1, 30),
        (37, 130, 3, TRUE, TRUE, 'Ocean View', 2, 25),
        (37, 155, 4, TRUE, NULL, 'Mountain View', 2, 30),
        (38, 105, 1, TRUE, TRUE, 'Ocean View', 1, 20),
        (38, 115, 2, False, FALSE, 'Mountain View', 1, 35),
        (38, 135, 3, TRUE, TRUE, 'Ocean View', 2, 20),
        (38, 155, 4, TRUE, NULL, 'Mountain View', 2, 35),
        (38, 155, 6, TRUE, NULL, 'Mountain View', 2, 35),
        (39, 90, 1, TRUE, NULL, 'Ocean View', 1, 20),
        (39, 105, 2, TRUE, TRUE, 'Ocean View', 1, 30),
        (39, 90, 3, TRUE, NULL, 'Ocean View', 1, 20),
        (39, 125, 4, False, TRUE, 'Mountain View', 2, 20),
        (39, 135, 5, TRUE, NULL, 'Ocean View', 2, 35),
        (40, 135, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (40, 145, 2, False, NULL, 'Ocean View', 1, 30),
        (40, 165, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (40, 175, 4, False, NULL, 'Mountain View', 2, 30),
        (40, 250, 5, False, TRUE, 'Ocean View', 3, 25),
        (41, 100, 1, False, TRUE, 'Ocean View', 1, 22),
        (41, 100, 2, False, TRUE, 'Ocean View', 1, 22),
        (41, 115, 3, False, TRUE, 'Ocean View', 1, 35),
        (41, 135, 4, False, TRUE, 'Ocean View', 2, 24),
        (41, 150, 5, False, NULL, 'Mountain View', 2, 31),
        (42, 105, 1, False, NULL, 'Mountain View', 1, 22),
        (42, 105, 2, False, NULL, 'Mountain View', 1, 22),
        (42, 110, 3, False, FALSE, 'Mountain View', 1, 35),
        (42, 130, 4, TRUE, TRUE, 'Ocean View', 2, 25),
        (42, 155, 5, False, TRUE, 'Ocean View', 2, 30),
        (43, 90, 1, False, TRUE, 'Ocean View', 1, 20),
        (43, 90, 2, False, TRUE, 'Ocean View', 1, 20),
        (43, 105, 3, False, FALSE, 'Mountain View', 1, 30),
        (43, 125, 4, False, TRUE, 'Ocean View', 2, 20),
        (43, 135, 5, TRUE, NULL, 'Ocean View', 2, 35),
        (44, 100, 1, TRUE, TRUE, 'Ocean View', 1, 22),
        (44, 100, 2, TRUE, TRUE, 'Ocean View', 1, 22),
        (44, 115, 3, TRUE, TRUE, 'Mountain View', 1, 35),
        (44, 135, 4, False, TRUE, 'Ocean View', 2, 24),
        (44, 160, 5, TRUE, NULL, 'Ocean View', 2, 35),
        (45, 105, 1, False, NULL, 'Mountain View', 1, 22),
        (45, 105, 2, False, NULL, 'Mountain View', 1, 22),
        (45, 115, 3, TRUE, TRUE, 'Mountain View', 1, 35),
        (45, 135, 4, TRUE, TRUE, 'Ocean View', 2, 25),
        (45, 155, 5, TRUE, NULL, 'Mountain View', 2, 30),
        (46, 135, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (46, 140, 2, False, NULL, 'Ocean View', 1, 35),
        (46, 165, 3, TRUE, NULL, 'Ocean View', 2, 25),
        (46, 170, 4, TRUE, TRUE, 'Ocean View', 2, 30),
        (46, 255, 5, False, TRUE, 'Mountain View', 3, 27),
        (47, 132, 1, TRUE, TRUE, 'Mountain View', 1, 20),
        (47, 144, 2, False, NULL, 'Ocean View', 1, 30),
        (47, 162, 3, TRUE, TRUE, 'Ocean View', 2, 25),
        (47, 174, 4, False, NULL, 'Ocean View', 2, 30),
        (47, 254, 5, False, TRUE, 'Mountain View', 3, 25),
        (48, 105, 1, False, NULL, 'Mountain View', 1, 22),
        (48, 105, 2, False, NULL, 'Mountain View', 1, 22),
        (48, 115, 3, TRUE, NULL, 'Ocean View', 1, 35),
        (48, 135, 4, TRUE, TRUE, 'Ocean View', 2, 24),
        (48, 155, 5, False, NULL, 'Mountain View', 2, 31),
        (49, 160, 1, False, NULL, 'Mountain View', 1, 20),
        (49, 170, 2, False, NULL, 'Ocean View', 1, 30),
        (49, 190, 3, TRUE, TRUE, 'Mountain View', 2, 20),
        (49, 210, 4, False, TRUE, 'Mountain View', 2, 30),
        (49, 310, 5, False, TRUE, 'Mountain View', 3, 40),
        (49, 290, 4, False, TRUE, 'Ocean View', 3, 10),
        (50, 150, 1, False, NULL, 'Ocean View', 1, 20),
        (50, 160, 2, TRUE, TRUE, 'Ocean View', 1, 30),
        (50, 180, 3, False, NULL, 'Mountain View', 2, 20),
        (50, 200, 4, False, NULL, 'Ocean View', 2, 30),
        (50, 300, 6, False, TRUE, 'Ocean View', 3, 40),
        (50, 280, 4, TRUE, TRUE, 'Ocean View', 3, 10),
        (50, 270, 4, False, TRUE, 'Mountain View', 3, 7);
    `;

  await sql`
    INSERT INTO reservations (user_id, room_id, price, archived, number_guests, start_date, end_date) VALUES
        (1, 1, 100, False, 1, '2023-03-08', '2023-03-12');
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
