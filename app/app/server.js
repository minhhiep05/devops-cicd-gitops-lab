const express = require('express');
const { Pool } = require('pg');
const client = require('prom-client');
const app = express();
const port = 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@postgres-service:5432/mydb'
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(JSON.stringify({ level: 'info', message: 'Read database time success' }));
    res.send(`K3s App Running v10! Database Time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', error: err.message }));
    res.status(500).send('Database Error');
  }
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => console.log(`Server started on port ${port}`));
// test webhook
