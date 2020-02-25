#!/bin/bash

echo "********************************************************************"
echo "***************** Starting replica set initialize ******************"
echo "********************************************************************"
until mongo --host mongo1:27010 --eval "print(\"waited for connection\")"
do
    sleep 10
done
mongo --host mongo1:27010 ./src/rs_initiate.js
echo "********************************************************************"
echo "***************** Finish replica set initialize ********************"
echo "********************************************************************"
