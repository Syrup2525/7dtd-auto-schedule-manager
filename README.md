# 7DTD Auto Schedule Manager

소개글
---
> 특정 시간에 맞추어 자동으로 데디케이트 서버를 구동하고 종료하는 Node.js 프로젝트 입니다.

> 사용자가 설정한 시간에 맞추어 bat 파일을 자동으로 실행시켜 데디케이트 서버를 구동하고 7DTD 데디케이트 서버에서 제공되는 telnet 기능을 이용하여 공지 및 서버 종료 명령어를 실행하는 자동 스케줄 관리 매니저 입니다.

주요 사용 Module
---
* node-cron: 스케줄에 따라 주요 동작을 실행하는 모듈
* telnet-client: 7DTD 데디케이트 서버 명령어를 실행하기 위한 핵심 모듈

사용 방법
---
1. .env 파일 작성: 아래 예시를 참고하여 프로젝트 최상위 폴더에 파일을 생성후 내용을 기입해 주세요.
2. setting.json 파일 작성: 아래 예시를 참고하여 프로젝트 최상위 폴더에 파일을 생성후 내용을 기입해 주세요.
3. startServer.bat: 아래 예시를 참고하여 프로젝트 최상위 폴더에 파일을 생성후 내용을 기입해 주세요.
4. 다음과 같은 구성이 되어야 됩니다.

    - common
        - define.js
        - util.js
    - model
        - dedicatedServer.js
        - process.js
        - telnet.js
    - .env
    - core.js
    - logger.js
    - main.js
    - package.json
    - setting.json
    - startServer.bat

5. node 명령어를 이용하여 프로젝트를 실행합니다
```
npm i
```
```
node main.js
```

.env
---
```env
TELNET_HOST=localhost
TELNET_PORT=
TELNET_PASSWORD=
BATCH_FILE_NAME=startServer.bat
```
- TELNET_PORT: serverconfig.xml 파일에서 설정한 TelnetPort 값
- TELNET_PASSWORD: serverconfig.xml 파일에서 설정한 TelnetPassword 값

> 7DTD 데디케이트 서버 telnet 기능을 사용하기 위해 serverconfig.xml 파일의 TelnetEnabled 값을 true 로 설정하여야 합니다.

> serverconfig.xml 파일의 TelnetPassword 속성에 값을 "" 로 (default) 기입한 경우에는 localhost 에서만 telnet 접속이 가능합니다.

setting.json
---
```json
[
    { 
        "dayOfWeek": 1,
        "startTime": "20:00",
        "spendMinute": 180
    },
    { 
        "dayOfWeek": 2,
        "startTime": "20:00",
        "spendMinute": 180
    },
    { 
        "dayOfWeek": 3,
        "startTime": "20:00",
        "spendMinute": 180
    },
    { 
        "dayOfWeek": 4,
        "startTime": "20:00",
        "spendMinute": 180
    },
    { 
        "dayOfWeek": 5,
        "startTime": "20:00",
        "spendMinute": 360
    },
    { 
        "dayOfWeek": 6,
        "startTime": "15:00",
        "spendMinute": 660
    },
    { 
        "dayOfWeek": 0,
        "startTime": "15:00",
        "spendMinute": 480
    }
]
```
- dayOfWeek: 설정하고자 하는 요일 입니다. (0: 일요일, 5: 금요일)
- startTime: MMdd 형식의 서버 시작 날짜 시간입니다.
- spendMinute: startTime 이후 서버가 종료될때까지 걸릴 분단위 값입니다.

    > 위 예시를 적용할시 데디케이트 서버 구동시간은 아래와 같습니다.   
    >   
    > [월] 20:00 ~ [월] 23:00   
    > [화] 20:00 ~ [화] 23:00   
    > [수] 20:00 ~ [수] 23:00   
    > [목] 20:00 ~ [목] 23:00   
    > [금] 20:00 ~ [토] 02:00   
    > [토] 15:00 ~ [일] 02:00   
    > [일] 15:00 ~ [일] 23:00   

startServer.bat (예시)
---
```bat
@echo off

set STEAMCMD_PATH="C:\DedicatedServer\Steam CMD"
set DEDICATED_SERVER_PATH="C:\DedicatedServer\DaysToDie"

set STEAMCMD_CMD=steamcmd.exe +force_install_dir %DEDICATED_SERVER_PATH% +login anonymous +app_update 294420 +quit
set DEDICATED_SERVER_CMD=startdedicated.bat

:start_server

echo Update Server
start /D %STEAMCMD_PATH% /B /WAIT %STEAMCMD_CMD%

echo Start Server
start /D %DEDICATED_SERVER_PATH% /B /WAIT %DEDICATED_SERVER_CMD%
```
- STEAM CMD 명령어를 활용하여 자동으로 데디케이트 서버를 업데이트하고 실행하는 패치 파일 예시 입니다.
- STEAMCMD_PATH 값과 DEDICATED_SERVER_PATH 값을 환경에 맞게 적절히 변경 해주세요.