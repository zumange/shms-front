@echo off

for /f "tokens=*" %%i in ('docker ps -q --filter "name=shms-front"') do (
    docker stop %%i
    docker rm %%i
)

docker rmi -f shms-front

docker build -t shms-front .

docker run -p 4201:4200 shms-front