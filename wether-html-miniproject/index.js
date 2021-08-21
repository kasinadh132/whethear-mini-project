const http = require("http");
const fs = require("fs");
var requests = require('requests');
const homefile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", parseFloat(orgVal.main.temp - 273).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", parseFloat(orgVal.main.temp_min - 273).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", parseFloat(orgVal.main.temp_max - 273).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Patna&appid=a74776949e6ab6d2953cf7ef9092fc78")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                // console.log(arrdata);
                const realTimeData = arrdata
                    .map((val) => replaceVal(homefile, val))
                    .join("");
                //   console.log(realTimeData);
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(8000, "127.0.0.1");