################################################################################
# File Name : test.py
# Created By : Adam Berard
# Creation Date : 02-12-2019
# Last Modified : Mon Dec  2 16:03:22 2019
# Description:

################################################################################
# Imports
import requests

################################################################################
# Vars
url = "http://localhost:8000/verticalAPI/"

################################################################################
if __name__ == '__main__':
   data = {"number": 4}
   x = requests.get(url, json=data)
   print(x.text)
