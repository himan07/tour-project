const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

// app.use(express.json()); //middleware

// write your own middleware
app.use((req, res, next) => {
  console.log("Hello from the middleware!");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// using 3rd party middleware
app.use(morgan("dev"));
const port = 3000;

const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tour-simple.json`)
);

// Get api call
app.get("/api/v1/tour", (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
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

// update data using patch method
app.patch("/api/v1/tour/:id", (req, res) => {
  const id = req.params.id * 1;
  if (id > tour.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour is here!>",
    },
  });
});

// delete api call
app.delete("/api/v1/tour/:id", (req, res) => {
  const id = req.params.id * 1;
  if (id > tour.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// param middleware
app.param('id', (req, res, next, value)=>{
console.log(`Tour id is: ${value}`)
next()

})

app.listen(port, () => {
  console.log(`app is listening on the port: ${port}`);
});
