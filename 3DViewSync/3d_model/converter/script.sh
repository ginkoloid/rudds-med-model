#!/bin/bash

if [ $# -ne 2 ]; then
  #statements
  echo "指定された引数は$#個です"
  exit 1
fi

python convert_obj_three.py -i $1 -o $2
ruby parse.rb $2
mv $2 ../js/
