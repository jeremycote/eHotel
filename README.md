# eHotel

## Getting Started

1. Install [NodeJS](https://nodejs.org/en/) (V16 or greater).
2. Install Yarn

```bash
npm install --global yarn
```

3. Create a postgres database named: <b>eHotel</b>
4. Create a copy of .env.local.example named .env.local and change the parameters to connect to your database.
5. Install packages

```bash
yarn install
```

6. Populate the database with sample data

```bash
yarn migrate:up
```

7. Start the webserver

```bash
yarn dev
```

8. Access the server at localhost:3000. The following users already exist:
<table>
<tr>
    <th>email</th>
    <th>password</th>
</tr>
<tr>
    <td>employee@hotel.com</td>
    <td>employee</td>
</tr>
<tr>
    <td>employee2@hotel.com</td>
    <td>employee</td>
</tr>
<tr>
    <td>client@hotel.com</td>
    <td>client</td>
</tr>
<tr>
    <td>client2@hotel.com</td>
    <td>client</td>
</tr>
</table>

## SQL

All SQL queries are found in the migrations folder.
