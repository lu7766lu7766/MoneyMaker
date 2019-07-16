# -*- coding: utf-8 -*-
import PyWinDDE
from datetime import datetime, timedelta
import sys
import time
import numpy as np

oldValue = []


def fimtxnReciver(value, item):
  global oldValue
  aValue = value.split(";")
  if (np.array_equal(aValue, oldValue)):
    return

  now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  settleEndTime = datetime.now().strftime("%Y-%m-%d 13:45:00")
  settleStartTime = datetime.now().strftime("%Y-%m-%d 15:00:00")

  if (now > settleEndTime and now < settleStartTime):
    return

  date = ""
  if (now <= settleEndTime):
    date = (datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d")
  else:
    date = datetime.today().strftime("%Y-%m-%d")

  # print(date)
  price = aValue[0]
  open = aValue[1]
  high = aValue[2]
  low = aValue[3]
  # print(int(float(aValue[4])))
  volume = aValue[4].split('.')[0]
  out_string = "date: %s; price:%s; open:%s; high:%s; low:%s; volume:%s; - %s" % (
      date, price, open, high, low, volume, now)
  # datetime.datetime.now()
  print(out_string)

  oldValue = aValue
  #f2.write(out_string + "\n")


# main function
while True:
  try:
    dde = PyWinDDE.DDEClient("XQLITE", "Quote")
    break
  except:
    e = sys.exc_info()[0]
    errpr_string = "Error: %s, try to connect 60 mins later." % e
    print(errpr_string)
    time.sleep(3600)
    print("Connect to DDE server again...")

print("Connected to DDE server, start listening...")
# 股票/期貨代號,名稱,時間,買進,賣出,成交,單量,總量,高點,低點,開盤
dde.advise("FIMTXN*1.TF-price,Open,High,Low,TotalVolume", callback=fimtxnReciver)
PyWinDDE.WinMSGLoop()
