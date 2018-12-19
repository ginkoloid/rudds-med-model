#!/bin/sh
pass="public/javascripts/" 
js="ps3dController.js"
js1="ps3dModel.js"
js2="ps3dView.js"
js3="initialize.js"

script="jsdoc app.js $pass$js $pass$js1 $pass$js2 $pass$js3"
$script
mv out docs
