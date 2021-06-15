const http = require("http");
const fs = require("fs");
const requests = require('requests');

const homeFile = fs.readFileSync("index.html","utf-8");
const replaceVal = (tempVal,orgVal) => {
   let temp = tempVal.replace("{%tempval%}", orgVal.main.temp)
   temp = temp.replace("{%tempmin%}", orgVal.main.temp_min)
   temp = temp.replace("{%tempmax%}", orgVal.main.temp_max)
   temp = temp.replace("{%location%}", orgVal.name)
   temp = temp.replace("{%country%}", orgVal.sys.country);
   temp = temp.replace("{%tempstat%}", orgVal.weather[0].main);
   return temp;
}
const server = http.createServer((req,res)=>{
   if(req.url=="/"){
    requests('http://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&appid=7e4076ba41385d52ceb8e7fbf237bbd9')
    .on('data',  (chunk)=> {
        const objData = JSON.parse(chunk);
        const arrData = [objData]
      console.log(arrData[0].main.temp);
     const rltData = arrData.map((currVal)=>replaceVal(homeFile,currVal)).join("");
     res.write(rltData);
    //  console.log(rltData);
    })
    .on('end',  (err) =>{
      if (err) return console.log('connection closed due to errors', err);
     
      res.end()
    });
   }
})

server.listen(8000,"127.0.0.1",()=>{
    console.log("listening port at 8000 ");
})