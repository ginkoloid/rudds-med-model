#! /usr/bin/env python
# -*- coding: utf-8 -*-

# python convert_to_total.py > output_filename 

import os
import sys
import numpy

# 取得したファイルデータを整形して，リスト形式で返す
def get_column(input_filename, target):	
	# 入力ファイルを開く	
	input_file = open(target_dir + input_filename);	
        a_list = []  	
	for line in input_file:
		if(line != '\n'): # delete blank line
			row = line.split()
                        if(row[1] == "THREE.WebGLRenderer" or row[1] != target): continue
			a_list.append(row[2])
        input_file.close()
	return map(int, a_list)

target_dir = './data/'
list_input_filename = os.listdir(target_dir)

for input_filename in list_input_filename:

	# 送信時間を取得する 
	t1 = get_column(input_filename, "OUT")
	
        # 受信時間を取得する 
	t2 = get_column(input_filename, "IN")

        # レスポンスタイムを求める
        response_times = [t2[i] - t1[i] for i in xrange(len(t2))]

	# 信頼区間90%で，下限5%と上限5%を削除する
	# データが200個なので，昇順したものを上から10個，下から10個削除する	
        response_times.sort()
	#del response_times[0:10]	
	del response_times[-10:]	
        #print response_times 
	
        # 整形したデータからクライアント数，平均値，最大値，最小値を取得する	
        client_of_number = int(input_filename.replace('client','').replace('.txt',''))
	average = numpy.average(response_times) 
        max_val = max(response_times)
        min_val = min(response_times)

	# 取得したデータを書き出す
	print ("%s %.1lf %d %d" % (client_of_number, average, max_val, min_val))

