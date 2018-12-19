import sys
import threading
import time
import datetime
import random

from selenium import webdriver
from selenium.webdriver import ActionChains

class TestThread(threading.Thread):
	def __init__(self, number_of_seconds,mode):
		super(TestThread, self).__init__()
		self.number_of_seconds = number_of_seconds
		self.driver = webdriver.Chrome()
		self.driver.get('http://rudds.jp:3000');
		self.canvas = self.driver.find_element_by_tag_name('canvas')
		if mode == 1:
			self.pen = self.driver.find_element_by_id('pencil').click()
		elif mode == 2:
			self.pen = self.driver.find_element_by_id('pencil').click()
		self.actions = webdriver.ActionChains(self.driver)
		for i in xrange(20):
			if mode == 0:
				self.actions.drag_and_drop_by_offset(self.canvas, 1, 1)
			elif mode == 1:
				self.actions.move_to_element(self.canvas)
				self.actions.drag_and_drop_by_offset(self.canvas, 1, 1)
			elif mode == 2:
				# self.actions.move_to_element(self.canvas)
				self.actions.drag_and_drop_by_offset(self.canvas, 1, 1)
			else:
				self.actions.move_by_offset(1,1).click()
				self.actions.move_to_element_with_offset(self.canvas,1,1).click()

	def __del__(self):
		try:
			self.driver.quit()
		except:
			pass

	def run(self):
		for i in range(self.number_of_seconds):
			t = random.uniform(1,5)
			if mode == 0:
				time.sleep(1)
				self.drag()
			elif mode == 1:
				time.sleep(1)
				self.drag()
			else:
				time.sleep(t)
				self.drag()

	def drag(self):
		self.actions.perform()

if __name__ == "__main__":
	clients = []
	number_of_clients = int(sys.argv[1])
	number_of_seconds = int(sys.argv[2])
	mode = 0
	if (len(sys.argv) > 3):
		mode = int(sys.argv[3])
	for i in range(number_of_clients):
		client = TestThread(number_of_seconds,mode)
		clients.append(client)
	for client in clients:
		client.start()

	time.sleep(number_of_seconds)
