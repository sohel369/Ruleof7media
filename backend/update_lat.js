const db=require('./db'); 
db.connectDb().then(() => {
  db.query("UPDATE affiliates SET lat = 40.7128, lon = -74.0060 WHERE territory ILIKE '%new york%'").then(() => {
    console.log('Updated'); 
    process.exit();
  });
});
