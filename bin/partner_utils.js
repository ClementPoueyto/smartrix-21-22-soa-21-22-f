const yargs = require('yargs');

module.exports = { showHelp: showHelp, respond: respond };
const usage =
  '\nUsage: Pship <partner_id> <district_id> <consumption> <starting_hour> <ending_hour>';

function showHelp() {
  console.log(usage);
  console.log('\nOptions:\r');
  console.log('--p\t--partner_id\t      Id of partner\t\t\t\t\t\t[number]\r');
  console.log("--d\t--district_id\t      District's Id\t\t\t\t\t\t[number]\r");
  console.log(
    '--c\t--consumption\t      Quantity of energy needed\t\t\t\t\t[number]\r',
  );
  console.log(
    '--s\t--starting_hour\t      When you need the energy (hour) starting from 9pm\t\t[number]',
  );
  console.log(
    "--e\t--ending_hour\t      The hour we'll stop providing energy (hour) up to 6am\t[number]",
  );
  console.log(
    '\t--version\t      ' +
      'Show version number.' +
      '\t\t\t\t\t' +
      '[boolean]\r',
  );
  console.log(
    '\t--help\t\t      ' + 'Show help.' + '\t\t\t\t\t\t' + '[boolean]\n',
  );
}

function respond() {
  let args = yargs.argv._;
  const XMLHttpRequest = require('xhr2');
  const Http = new XMLHttpRequest();

  console.log('Merci ! Votre demande a été prise en compte');
  console.log(
    "Vous pourriez consommer jusqu'à " +
      args[2] +
      ' KW entre ' +
      args[3] +
      'h et ' +
      args[4] +
      'h',
  );
  const url2 = 'http://localhost:3006/futureconsumption';
  Http.open('POST', url2, true);
  var data = {
    id: args[0],
    idClient: args[0],
    districtId: args[1],
    consumption: args[2],
    beg_hour: args[3],
    end_hour: args[4],
  };

  console.log(JSON.stringify(data));

  Http.setRequestHeader('Content-Type', 'application/json');
  Http.send(JSON.stringify(data));
}
