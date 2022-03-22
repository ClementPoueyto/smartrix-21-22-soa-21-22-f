yellow='\033[0;33m'
blue="\033[0;36m"
magenta="\033[0;35m"
purple="\e[0;35m"
red="\e[0;31m"
none='\033[0m' 


echo -e "${magenta}--- SCENARIO 2---"
echo -e "${purple}La gestion des districts"
echo -e "\n"

echo -e "${yellow}Elon est en district X, il demande de la consommation future pour 22h"
echo -e "${blue} Request post send with a demand of futur consumption ${none}"
curl --silent http://localhost:3006/futureconsumption -H "Content-type:application/json" -X POST -d "{\"consumption\": 5000, \"idClient\": 3,\"districtId\": 1,\"beg_hour\": 22,\"end_hour\": 23}"
echo -e  "future consumption saved:  $(docker logs consumption-requester --tail 1)"
echo -e "${yellow}nikolas remarque sur la balance que la production du district 3 dépasse la limite de production ${none}"
echo -e "${blue} send consumption to overconsume  ${none}"
now=`date --iso-8601=seconds`
curl --silent http://localhost:3002/consume -H "Content-type:application/json" -X POST -d "{\"timestamp\": \"null\", \"clientId\": 3, \"districtId\": 3, \"consumptionByOutlet\" : { \"0\" : { \"status\":\"ESSENTIAL\", \"consumption\" : 330 }} ,\"source\": \"GRID\"}"
sleep 5
docker logs balancer --tail 2

# (US5 et US2),BUS

echo -e "${yellow} il décide de bloquer les consommations non essentielle pour ce district ${none}"
docker logs production-requester --tail 1


#echo -e "${yellow}Pendant 1h, le district Y parvient à l’autarcie"
#echo -e "${blue} Request get information of autarcy about Y{none}"
#curl --silent http://localhost:3006/futureconsumption -H "Content-type:application/json" -X POST -d "{\"consumption\": 5000, \"clientId\": 3,\"districtId\": 1,\"beg_hour\": 22,\"end_hour\": 2}"
