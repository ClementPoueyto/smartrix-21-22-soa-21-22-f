#! /usr/bin/env node

const yargs = require("yargs");
const utils = require('./partner_utils.js')

//pship short for partnership
const usage = "\nUsage: pship <partner_id> <district_id> <consumption> <starting_hour> <ending_hour>";

const options = yargs
  .usage(usage)
  .option("p", {alias:"partner_id", describe: "Id of partner", type: "number", demandOption: false })
  .option("d", {alias: "district_id", describe: "District's Id", type:"number" , demandOption: false})
  .option("c",{alias:"consumption", describe: "Quantity of energy needed", type: "number", demandOption: false })
  .option("s",{alias:"starting_hour", describe: "When you need the energy (hour) starting from 9pm", type: "number", demandOption: false })
  .option("e",{alias:"ending_hour", describe: "The hour we'll stop providing energy (hour) up to 6am",type:"number", demandOption: false})
  .help(true)
  .argv;



if(yargs.argv._[0] == null){
  utils.showHelp();
  return;
}
else {utils.respond();return;}