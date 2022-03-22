echo "[INFO] run : Launching the project..."
docker-compose --profile real_time down -v
docker-compose --profile mock down -v
docker-compose up -d 
pip install -r ./mock/requirements.txt
python ./mock/mocker.py
docker-compose run -d -p 3002:3002 --name house house
sleep 10
curl --silent http://localhost:3004/mode -H "Content-type:application/json" -X POST -d "{ \"mode\": \"REAL_TIME\" }"
curl --silent http://localhost:3003/mode -H "Content-type:application/json" -X POST -d "{ \"mode\": \"REAL_TIME\" }"
curl --silent http://localhost:3017/mode -H "Content-type:application/json" -X POST -d "{ \"mode\": \"REAL_TIME\" }"

echo "[INFO] All services started"

#  real time: docker-compose --profile real_time up -d
