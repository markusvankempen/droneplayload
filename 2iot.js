/*

markus van Kempen - mvk@ca.ibm.com

Sends mqtt message to IoT and Waits for commands to control a servo motor
*/
var iotf = require("./");
var config = require("./device.json");
//var ws281x = require('rpi-ws281x-native');

var mincycle = 500; var maxcycle = 2300 ;
var dutycycle = mincycle;

// Init board, setup software PWM on pin 26.
var Gpio = require('pigpio').Gpio;
var motor = new Gpio(7, {mode: Gpio.OUTPUT});

var deviceClient = new iotf.IotfDevice(config);
function sleep( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

//setting the log level to trace. By default its 'warn'
deviceClient.log.setLevel('debug');

console.log("start");
// pulsestart,increment,time,stopat
// motor.servoWrite(1800); //open
// turnMe(800,100,1000,900); //close
//sleep(5000);
//turnMe(2000,100,1000,2100);
//turnMe(500,100,1000);  
deviceClient.connect();

deviceClient.on('connect', function(){ 
    var i=0;
    console.log("connected");
    setInterval(function function_name () {
    	i++;
    	deviceClient.publish('myevt', 'json', '{"value":'+i+'}', 2);
    },2000);
});

deviceClient.on('reconnect', function(){ 

	console.log("Reconnected!!!");
});

deviceClient.on('disconnect', function(){
  console.log('Disconnected from IoTF');
});

deviceClient.on('error', function (argument) {
	console.log(argument);
});



deviceClient.on("command", function (commandName,format,payload,topic) {
   
console.log("Command:", commandName);
console.log("payload = "+JSON.parse(payload));
myjson = JSON.parse(payload);
console.log("payload = "+JSON.stringify(payload));

     if(commandName === "motorOpen") {
   console.log("motorOpen value = "+myjson.d.turn);
   console.log("pulseWidth value = "+myjson.d.pulseWidth);
   console.log("increment value = "+myjson.d.increment);
   console.log("interval value = "+myjson.d.interval);
   console.log("stopat value = "+myjson.d.stopat);
   console.log("motorSpin value = "+myjson.d.motorSpin);
   //console.log("motorOpen value"+payload.d.turn);
        //function to be performed for this command
        //blink(payload);
//	turnMe(2000,500,500);
	motor.servoWrite(myjson.d.motorSpin); //open
//turnMe(pulseWidth,increment,interval,stopat); 
 
    } else if(commandName === "motorClose") {
        console.log("motorClose");
   console.log("motorOpen value"+myjson.d.turn);
   console.log("pulseWidth value = "+myjson.d.pulseWidth);
   console.log("increment value = "+myjson.d.increment);
   console.log("interval value = "+myjson.d.interval);
   console.log("stopat value = "+myjson.d.stopat);
   console.log("motorSpin value = "+myjson.d.motorSpin);
   //console.log("motorOpen value"+payload.d.turn);
        //function to be performed for this command
        //blink(payload);
//      turnMe(2000,500,500);
        motor.servoWrite(myjson.d.motorSpin); //open


        //function to be performed for this command
        //blink(payload);
	//turnMe(1000,100,1000);
motor.servoWrite(myjson.d.motorSpin); //open
//turnMe(600,100,1000,700); //close
    } else {
        console.log("Command not supported.. " + commandName);
    }
});

function turnMe(pulseWidth,increment,interval,stopat){
console.log("turnMe >  pulse = "+pulseWidth+ " increment="+increment +" interval ="+interval+ " stopat="+stopat);
bincrement = increment;
refreshIntervalId = setInterval(function () {
  motor.servoWrite(pulseWidth);

  pulseWidth += increment;
  if (pulseWidth >= stopat) {
console.log("Clear Timer , pulse = "+pulseWidth);
clearInterval(refreshIntervalId);  
return(1);
//exit; 
}else{
console.log("pulse = "+pulseWidth);
}

}, interval);

}

function turn1(){
 pulseWidth = 2300,
  increment = 100;

refreshIntervalId = setInterval(function () {
  motor.servoWrite(pulseWidth);

  pulseWidth -= increment;
  if (pulseWidth <= 1000) {

clearInterval(refreshIntervalId);
 }
}, 500);

}

function launchWaveReturn(){
  setInterval(function () {
    motor.servoWrite(maxcycle);
    console.log("set to",maxcycle);
    setTimeout(function(){
      console.log("reset to", mincycle)
        motor.servoWrite(mincycle);
    }, waveinterval/3);
  }, waveinterval);
}
