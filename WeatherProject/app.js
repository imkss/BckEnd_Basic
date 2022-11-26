const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let time = new Date();
  var options = {
    hour: "2-digit",
    minute: "2-digit",
  };

  var hour = time.toLocaleTimeString("en-US", options);
  res.render("res", { timeNow: hour });

  res.sendFile(__dirname + "/res.ejs");
});

app.post("/", function (req, res) {
  console.log("Post request recieved");
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const apiKey = "452c055611175f50daa4a7c3ef309cde";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;
  // const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}i&appid=${apiKey}&units=${unit}`; FUCK YOU :)

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData);

      const temp = weatherData.main.temp;

      const desc = weatherData.weather[0].description;

      const icon = weatherData.weather[0].icon;

      const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write(` <p><b>The weather is currently</b></p> ${desc}`);
      res.write(
        ` <h1>The temperature in ${query} is ${temp} degrees Celcius.</h2>`
      );
      res.write(`<img src = ${imgURL}>`);
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
