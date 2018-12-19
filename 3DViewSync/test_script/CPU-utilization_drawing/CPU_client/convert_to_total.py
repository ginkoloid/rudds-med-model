#! /usr/bin/env python
# -*- coding: utf-8 -*-

# python convert_to_total.py > output_filename

import os
import sys
import numpy

# 取得したファイルデータを整形して，リスト形式で返す
def get_format_list(input_file):
	format_list = []
	for line in input_file:
		if(line != '\n'): # delete blank line
			line = line.split()
			if(line[0] == "Average:" or line[1] == "%usr"): continue
			format_list.append(int(line[1]))
	return format_list

target_dir = './data/'
list_input_filename = os.listdir(target_dir)

for input_filename in list_input_filename:

	# 入力ファイルを開く
	input_file = open(target_dir + input_filename);

	# 入力ファイルのデータを整形する
	format_list = get_format_list(input_file)

	# 信頼区間90%で，下限5%と上限5%を削除する
	# データが200個なので，昇順したものを上から10個，下から10個削除する
	format_list.sort()
	del format_list[0:10]
	del format_list[-10:]

	# 整形したデータからクライアント数，平均値，最大値，最小値を取得する

	client_of_number = int(input_filename.replace('client','').replace('.txt',''))
	average = numpy.average(format_list)
	max_val = max(format_list)
	min_val = min(format_list)

	# 取得したデータを書き出す
	print ("%s %.1lf %d %d" % (client_of_number, average, max_val, min_val))

	# ファイルを閉じる
	input_file.close()
