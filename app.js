const express = require("express");
const fs = require("fs");

const app = express();

const port = 3000;

const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tour-simple.json`)
);

app.get("/api/v1/tour", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tour.length,
    data: {
      tours: tour,
    },
  });
});

app.listen(port, () => {
  console.log(`app is listening on the port: ${port}`);
});
