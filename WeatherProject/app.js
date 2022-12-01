const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
var temp,
  desc,
  min,
  max,
  lName,
  hum,
  pre,
  win,
  imgURL = "";
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.post("/", function (req, res) {
  console.log("Post request recieved");
  // console.log(req.body.cityName);

  const query = req.body.cityName;
  const apiKey = "452c055611175f50daa4a7c3ef309cde";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;
  // const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}i&appid=${apiKey}&units=${unit}`; FUCK YOU :)

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      // console.log(weatherData);

      const lName = weatherData.name;
      const temp = weatherData.main.feels_like;
      const min = weatherData.main.temp_min;
      const max = weatherData.main.temp_max;
      const pre = weatherData.main.pressure;
      const hum = weatherData.main.humidity;
      const win = weatherData.wind.speed;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      console.log(lName, temp, min, max, pre, hum, win, desc, imgURL);

      /*************************************** */

      //BASIC OP IS THIS

      // res.write(` <p><b>The weather is currently</b></p> ${desc}`);
      // res.write(
      //   ` <h1>The temperature in ${query} is ${temp} degrees Celcius.</h2>`
      // );

      // res.write(` <h2>Min Temp :: ${min}<br>Max Temp :: ${max}</h2>`);

      // res.write(` <h3>Wind :: ${win} Km/Hr</h3>`);

      // res.write(` <h4>Humidity :: ${hum}<br>Pressure :: ${pre}</h4>`);

      // res.write(`<img src = ${imgURL}>`);
      // res.send();

      /*************************************** */
      

      // res.redirect("/"); I DON"T KNOW WHEN IT WILL BE USED :?
    });
  });

  // FOR FAILURE
  // const request = https.request(function (response) {
  //   if (response.statusCode === 200) {
  //     res.sendFile(`${__dirname}/res.ejs`);
  //   } else {
  //     res.sendFile(__dirname + "/failure.ejs");
  //   }

  //   response.on("data", function (data) {
  //     console.log(JSON.parse(data));
  //   });
  // });
  // app.post("/failure", function (req, res) {
  //   res.redirect("/");
  // });
});

app.get("/", function (req, res) {
  let time = new Date();
  var options = {
    hour: "2-digit",
    minute: "2-digit",
  };

  var hour = time.toLocaleTimeString("en-US", options);
  res.render("res", {
    timeNow: hour,
    lName: lName,
    temp: temp,
    min: min,
    max: max,
    pre: pre,
    win: win,
    hum: hum,
    desc: desc
  });
  // res.send();
  // res.sendFile(__dirname + "/res.ejs");
});

app.listen(3300, function () {
  console.log("Server is running on port 3300");
});
