yellow='\033[0;33m'
blue="\033[0;36m"
magenta="\033[0;35m"
purple="\e[0;35m"
red="\e[0;31m"
none='\033[0m' 


echo -e "${magenta}--- SCENARIO 1 ---"
echo -e "${yellow}Pierre et Marie adorent la technologie et n’hésitent jamais à rajouter de nouveaux devices chez eux."
echo -e "\n"
clientId=1
districtId=2
year=$(date +%Y)
now1=`date --iso-8601=seconds`
now2=$(date -d "$now1 - 1 month" --iso-8601=seconds)
now3=$(date -d "$now2 - 1 month" --iso-8601=seconds)
month1=$(date -d "$now1" '+%m')
month2=$(date -d "$now2" '+%m')
month3=$(date -d "$now3" '+%m')

echo -e ""
echo -e "Ils consultent leurs factures trimestrielles, en se connectant sur la UI du client grâce à leurs Id Client et ils remarquent que leur consommation a trop augmenter"
echo -e "${blue}Envoie d'une requête GET au service analytics pour récuperer la consommation ${none}"
echo -e
month1Consumption=$(curl --silent http://localhost:3005/statistics/month\?year=$year\&month=$month1\&clientId=$clientId -X GET)
month2Consumption=$(curl --silent http://localhost:3005/statistics/month\?year=$year\&month=$month2\&clientId=$clientId -X GET)
month3Consumption=$(curl --silent http://localhost:3005/statistics/month\?year=$year\&month=$month3\&clientId=$clientId -X GET)

echo -e "$month1/$year: \n $month1Consumption\n \n"
echo -e "$month2/$year: \n $month2Consumption\n \n"
echo -e "$month3/$year: \n $month3Consumption\n \n"

echo -e "${yellow}Ils décident d'installer des panneaux solaires. Après un mois, Charles remarque que P&M ont un excès de production "
echo -e "${blue}Envoie d'une requête POST au service house pour ajouter l'excès de production ${none}"
echo -e "${blue}Envoie d'une requête POST au service house pour ajouter la consumption par panneau solaire${none}"
max=30
now=`date --iso-8601=seconds`
for i in `seq 1 $max`
do
    now=$(date -d "$now + 1 days" --iso-8601=seconds)
    future=$(date -d "$now" "+%D %T")
    curl --silent http://localhost:3002/produce -H "Content-type:application/json" -X POST -d "{\"timestamp\": \"$future\", \"districtId\": $districtId, \"production\": 500, \"productorId\": $clientId, \"supplierType\": \"CLIENT\", \"destination\": \"GRID\"}"
    curl --silent http://localhost:3002/consume -H "Content-type:application/json" -X POST -d "{\"timestamp\": \"$future\", \"clientId\": $clientId, \"districtId\": $districtId, \"consumptionByOutlet\": { \"0\": {\"consumption\": 250,\"status\": \"ESSENTIAL\"}, \"1\": {\"consumption\": 250,\"status\": \"NONESSENTIAL\"}}, \"source\": \"SOLAR\" }"
done

echo -e "${blue}Envoie d'une requête GET au service analytics pour voir la production client par mois ${none}"
monthProduction=$(curl --silent http://localhost:3005/production/statistics/month\?year=$year\&month=$month1\&clientId=$clientId -X GET)
echo -e $monthProduction

echo -e "\n"
endDate=$(date -d "$now + 3 years" --iso-8601=seconds)
echo -e "${yellow}Il leurs propose alors un contrat de 3 ans afin de racheter leur production pour 0.1€ le KW/H. "
echo -e "${blue}Envoie d'une requête POST au service ConsumptionContrat pour ajouter un contrat production  ${none}"
curl --silent http://localhost:3016/productioncontract -H "Content-type:application/json" -X POST -d "{\"id\": \"$clientId\", \"idClient\": $clientId, \"districtId\": $districtId, \"beg_date\": \"$now\", \"end_date\": \"$endDate\", \"price_KW\": 0.1}"
echo -e "\n${blue}Envoie d'une requête GET au service ConsumptionContrat pour récupérer le contrat  ${none}"
month3Consumption=$(curl --silent http://localhost:3016/productioncontract/client\?idClient=$clientId -X GET)
echo -e "\n"

echo -e "${yellow}P&M décident d’acheter une voiture électrique. Après avoir fait des courses, Ils rentrent chez eux à 19h et ils branchent leur voiture sur le « super chargeur »."
echo -e "${blue}Envoie d'une requête POST au service Supplier pour atteindre la limite de production du district  ${none}"
curl --silent http://localhost:3003/produce -H "Content-type:application/json" -X POST -d "{\"timestamp\": \"$now\", \"districtId\": $districtId, \"production\": 2455555, \"productorId\": $clientId, \"supplierType\": \"COMPANY\", \"destination\": \"GRID\"}"
sleep 5
echo -e "${blue}Envoie d'une requête POST au service ConsumptionRequester pour savoir s'il peuvent charger ou non  ${none}"
reponse=$(curl --silent http://localhost:3006/car-charger-demand\?carBattery=80\&clientId=$clientId\&districtId=$districtId -X GET)


echo -e "\n"
echo -e "${yellow}Charles qui surveille la grille, remarque que la batterie de la voiture est à 80% et que la grille est surchargée, et du coup il bloque le super chargeur et il planifie son déblocage en fin de soirée où la consommation est au plus bas. ${none}"
echo -e $reponse

echo -e "\n"
echo -e "${yellow}Thomas, propose à P&M son produit, et il les a convaincus de stocker une partie de leur énergie sur des batteries. Maintenant P&M stockent de l’énergie sur la batterie "
echo -e "${blue}Envoie d'une requête POST au service house pour produire pour la nouvelle batterie  ${none}"
curl --silent http://localhost:3002/produce -H "Content-type:application/json" -X POST -d "{\"timestamp\": \"$now\", \"districtId\": $districtId, \"production\": 500, \"productorId\": $clientId, \"supplierType\": \"CLIENT\", \"destination\": \"BATTERY\"}"

echo -e "\n"
echo -e "${yellow}P&M consultent leur compte, et il remarque que pour aujourd’hui, ils ont plus de consommation que de production, du coup ils utilisent l’énergie stocké sur la batterie pour parvenir à l’autarcie "
echo -e "${blue}Envoie d'une requête GET au service analytics pour voir la production du jour  ${none}"
echo -e "${blue}Envoie d'une requête GET au service analytics pour voir la consommation du jour  ${none}"
echo -e "${blue}Envoie d'une requête GET au service autarkyViewer pour voir l'état d'autarcie  ${none}"
day=$(date -d "$now" '+%d')
month=$(date -d "$now" '+%m')
dayConsumption=$(curl --silent http://localhost:3005/statistics/day\?year=$year\&month=$month\&day=$day\&clientId=$clientId -X GET)
dayProduction=$(curl --silent http://localhost:3005/production/statistics/day\?year=$year\&month=$month\&day=$day\&clientId=$clientId -X GET)
autarky=$(curl --silent http://localhost:3023/autarky/client/$clientId -X GET)
echo -e "Comparaison entre consommation et production \n\n $dayConsumption \n\n $dayProduction \n\n"

echo -e " Check de l'autarcie \n\n$autarky \n\n"
max=24
echo -e "${blue}Envoie de requêtes POST au service house pour voir ajouter production et consommation  ${none}"

for i in `seq 1 $max`
do
    now=$(date -d "$now + 1 hours" --iso-8601=seconds)
    future=$(date -d "$now" "+%D %T")
    curl --silent http://localhost:3002/produce -H "Content-type:application/json" -X POST -d "{\"timestamp\": \"$future\", \"districtId\": $districtId, \"production\": 400, \"productorId\": $clientId, \"supplierType\": \"CLIENT\", \"destination\": \"BATTERY\"}"
    curl --silent http://localhost:3002/consume -H "Content-type:application/json" -X POST -d "{\"timestamp\": \"$future\", \"clientId\": $clientId, \"districtId\": $districtId, \"consumptionByOutlet\": {
                        \"0\": {\"consumption\": 200,\"status\": \"ESSENTIAL\"},
                        \"1\": {\"consumption\": 300,\"status\": \"NONESSENTIAL\"}}, \"source\": \"GRID\" }"
done

echo -e "${blue}Envoie d'une requête GET au service autarkyViewer pour voir l'état d'autarcie  ${none}"
autarky=$(curl --silent http://localhost:3023/autarky/client/$clientId -X GET)
echo -e " Check de l'autarcie \n\n$autarky \n\n"

echo -e "\n"
echo -e "${yellow}Ce mois, c’est l’anniversaire de Marie, la fille de P&M, et ils veulent voir combien ils vont devoir payer pour leur énergie consommée du mois en cours, afin qu’ils puissent ajuster leur budget au plus près possible et préparer une fête pour l’anniversaire de Marie"
echo -e "${blue}Envoie d'une requête GET au service client invoice pour récupérer pour la facture du mois  ${none}"
reponse=$(curl --silent http://localhost:3009/invoice/client\?year=$year\&month=$month1\&idClient=$clientId -X GET)
echo -e "$reponse"
