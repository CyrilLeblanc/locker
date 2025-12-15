// This script runs when the MongoDB container is first initialized
// It creates a dedicated user for the app database

db = db.getSiblingDB('app');

db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'app'
    }
  ]
});

print('Created user "appuser" for database "app"');
