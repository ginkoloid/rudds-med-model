import sys
import threading
import time
import datetime

from selenium import webdriver
from selenium.webdriver import ActionChains

class TestThread(threading.Thread):
	def __init__(self, number_of_seconds):
		super(TestThread, self).__init__()
		self.number_of_seconds = number_of_seconds 
		self.driver = webdriver.Chrome()
		self.driver.get('http://rudds.kyoto-su.ac.jp:3000');
		self.canvas = self.driver.find_element_by_tag_name('canvas')	
		self.actions = webdriver.ActionChains(self.driver)
		for i in xrange(20):
			self.actions.drag_and_drop_by_offset(self.canvas, 1, 1)

	def __del__(self):
		try:
			self.driver.quit()
		except:
			pass

	def run(self):
		for i in range(self.number_of_seconds):
			time.sleep(1)
			self.drag()
	
	def drag(self):
		self.actions.perform()

if __name__ == "__main__":
	clients = []
	number_of_clients = int(sys.argv[1])
	number_of_seconds = int(sys.argv[2])
	for i in range(number_of_clients):
		client = TestThread(number_of_seconds)
		clients.append(client)
	for client in clients:
		client.start()
		
	time.sleep(number_of_seconds)

