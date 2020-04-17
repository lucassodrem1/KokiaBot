const { Client } = require('pg');

const client = new Client({
  user: "ijjueurkdgiptk",
  password: "d4511e432f2ca1cacab97ef16bace710e41ef218325a27702e7d4c2b787bf188",
  database: "dej89p83dl684j",
  port: "5432",
  host: "ec2-54-165-36-134.compute-1.amazonaws.com",
  ssl: true
});

client.connect()
  .catch(err => console.error('connection error', err.stack));

module.exports = { client }