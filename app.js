const EventEmitter = require('events');
const {
    pingV4Nn,
    readFiles,
    ipFromString,
    filterBadIpV4,
} = require('nodeutilz');


const args1 = process.argv[2];
const args2 = process.argv[3] === undefined ? 100 : +process.argv[3];

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

let counter = 0;
myEmitter.on('counterEvent', () => {
    console.log(counter++);
  });

const loopPingRequest = async (data) =>{
    while (args2 > counter) {
        const pingResult = await pingV4Nn(data);
        myEmitter.emit('counterEvent');
        loopPingRequest(data);
        return console.log(pingResult);
    }  
}

try {
    const ipArray = JSON.parse(args1);
    const ipAddresses = filterBadIpV4(ipArray)
    console.log(ipAddresses)
    loopPingRequest(ipAddresses);
} catch (error) {
    const ipAddressesToArray = filterBadIpV4(ipFromString(args1));
    console.log( ipAddressesToArray)
    loopPingRequest(ipAddressesToArray);

}
