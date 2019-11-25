const EventEmitter = require('events');
const {
    pingV4Nn,
    readFiles,
    writeFile,
    ipFromString,
    filterBadIpV4,
} = require('nodeutilz');


const args1 = process.argv[2];
const args2 = process.argv[3] === undefined ? 100 : +process.argv[3];

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

let counter = 0;

const evenLogData = [];
myEmitter.on('counterEvent', (data) => {
    console.log(data,counter++);
    evenLogData.push(data);
});

myEmitter.on('writeLogFile', (data) => {
    console.log(evenLogData);
    writeFile(`./export/pingLog_${Date.now()}.txt`,JSON.stringify(evenLogData,null,'\t','utf8'))
        .then(console.log) 
        .catch(console.log);
});

const loopPingRequest = async (data) =>{
    while (args2 > counter) {
        const pingResult = await pingV4Nn(data);
        myEmitter.emit('counterEvent',pingResult);
        return loopPingRequest(data);
    }  
    myEmitter.emit('writeLogFile');
}

try {
    const ipArray = JSON.parse(args1);
    const ipAddresses = filterBadIpV4(ipArray);
    // debuig
    //console.log(ipAddresses);
    loopPingRequest(ipAddresses);
} catch (error) {
    const ipAddressesToArray = filterBadIpV4(ipFromString(args1));
    // debug
    //console.log( ipAddressesToArray);
    loopPingRequest(ipAddressesToArray);

}
