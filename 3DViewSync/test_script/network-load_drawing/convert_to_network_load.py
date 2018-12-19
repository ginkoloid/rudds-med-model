#! /usr/bin/env python
# -*- coding: utf-8 -*-

# python convert_to_total.py > output_filename 

import os
import sys
import numpy

# 選択した列を返す 
def get_column(input_file, num):
	a_list = []  	
	for line in input_file:
		if line != '\n': # delete blank line
			row = line.split()	
			if len(row) != 6 or row[1] != "en0": continue
			if row[1] == "IFACE" or row[0] == "Average:": continue	
			a_list.append(row[num])
	return map(int, a_list)

target_dir = './network/'
list_input_filename = os.listdir(target_dir)

for input_filename in list_input_filename:
	
	# 入力ファイルを開く	
	input_file1 =  open(target_dir + input_filename)
	input_file2 =  open(target_dir + input_filename)
		
	# 受信バイト数と送信バイト数のリストを取得する
	ibytes = get_column(input_file1, 3)	
	obytes = get_column(input_file2, 5)	

	# 信頼区間90%で，下限5%と上限5%を削除する
	# データが200個なので，昇順したものを上から10個，下から10個削除する
	ibytes.sort()
	del ibytes[0:10]	
	del ibytes[-10:]	
	obytes.sort()
	del obytes[0:10]	
	del obytes[-10:]

	# 整形したデータからクライアント数，平均値，最大値，最小値を取得する	
	client_of_number = int(input_filename.replace('client','').replace('.txt',''))
	ibytes_ave = numpy.average(ibytes) 
	ibytes_max = max(ibytes) 
	ibytes_min = min(ibytes) 

	obytes_ave = numpy.average(obytes) 
	obytes_max = max(obytes) 
	obytes_min = min(obytes) 
	
	# 取得したデータを書き出す
	print ("%s %.1lf %d %d %.1lf %d %d" % (client_of_number, ibytes_ave, ibytes_max, ibytes_min, obytes_ave, obytes_max, obytes_min))

	# ファイルを閉じる
	input_file1.close()
	input_file2.close()

