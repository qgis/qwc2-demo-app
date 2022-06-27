#!/bin/sh
rm -f themes.json && wget http://localhost:8088/themes.json && sed -Ei 's#/(api|ows)/#http://localhost:8088/\1/#g' themes.json
cp -a /home/sandro/Documents/Devel/QWC2/qwc-docker/volumes/qwc2/assets/forms/autogen/* /home/sandro/Documents/Devel/QWC2/qwc2-demo-app/static/assets/forms/autogen/
