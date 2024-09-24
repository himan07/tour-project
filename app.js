const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json()); //middleware

const port = 3000;

const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tour-simple.json`)
);

// Get api call
app.get("/api/v1/tour", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tour.length,
    data: {
      tours: tour,
    },
  });
});

// Target data by ID
app.get("/api/v1/tour/:id", (req, res) => {
  const id = req.params.id * 1;
  if (id > tour.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  const tours = tour.find((el) => el.id === id);
  res.status(200).json({
    message: "success",
    data: {
      tours,
    },
  });
});

// Post api call
app.post("/api/v1/tour", (req, res) => {
  const newId = tour[tour.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tour.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tour-simple.json`,
    JSON.stringify(tour),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.listen(port, () => {
  console.log(`app is listening on the port: ${port}`);
});
