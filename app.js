require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/", function (req, res) {
  const query = _.upperFirst(req.body.cityName);
  const apikey = process.env.API_KEY;
  const unit = "metric";
  const url =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    unit +
    "&appid=" +
    apikey;

  http.get(url, function (response) {
    console.log(response.statusCode);
    if (response.statusCode != 200) {
      res.render("failure");
    } else {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = _.upperFirst(
          weatherData.weather[0].description
        );
        const icon = weatherData.weather[0].icon;

        console.log(weatherDescription);
        console.log(temp);
        console.log(icon);

        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.render("weather", {
          city: query,
          temp: temp,
          weatherDescription: weatherDescription,
          imageUrl: imageUrl,
        });
        /*
      res.write(
        "<h1>The temperature in " +
          query +
          " is " +
          temp +
          " degrees celcius</h1>"
      );
      res.write("<p>The weather is currently " + weatherDescription + ".</p>");
      res.write("<img src=" + imageUrl + ">");

      res.send();
      */
      });
    }
  });
  req.on("error", function (e) {
    res.send("Something went worng !!!");
  });
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
