# -*- coding: utf-8 -*-
import PyWinDDE
from datetime import datetime, timedelta
import sys
import time
import numpy as np
import AdonisWS
import json
import re 

def wsConnect():
  global ws
  while True:
    try:
      ws = AdonisWS.Client("ws://localhost:3333/adonis-ws")
      ws.subscripbe("DataCollect")
      break
    except:
      print("WS can't connect server, will try again...")
      time.sleep(3)
      wsConnect()
      
oldValue = []
oldTime = ''
wsConnect()

def fimtxnReciver(value, item):
  global oldTime, oldValue
  # svalue = value.replace("[\D\;]", "")
  # print(value)
  # print(item)
  # return 
  newValue = value.split(",")[:5]
  newTime = newValue[0]

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
  
  if (newTime != oldTime and oldTime != ''):
    open = oldValue[1]
    high = oldValue[2]
    low = oldValue[3]
    close = oldValue[4]
    while True:
      try:
        ws.emit("bordcast", json.dumps({
          "date": date,
          "close": close,
          "open": open,
          "high": high,
          "low": low,
          "created_at": now
        }))
        break
      except:
        print("WS disconnect try again...")
        time.sleep(3)
        wsConnect()
  # print(newValue)
  
  # if (np.array_equal(newValue, oldValue)):
  #   return
  oldValue = newValue
  oldTime = newTime
  

  # print(date)
  # open = newValue[1]
  # high = newValue[2]
  # low = newValue[3]
  # close = newValue[4]
  # print(int(float(newValue[4])))
  #out_string = "date: %s; price:%s; open:%s; high:%s; low:%s; volume:%s; - %s" % (
  #    date, price, open, high, low, volume, now)
  # datetime.datetime.now()
  #print(out_string)
  
      
      

  
  #f2.write(out_string + "\n")


# main function
while True:
  try:
    dde = PyWinDDE.DDEClient("XQLITE", "Kline")
    break
  except:
    e = sys.exc_info()[0]
    errpr_string = "Error: %s, try to connect 60 mins later." % e
    print(errpr_string)
    time.sleep(3600)
    print("Connect to DDE server again...")

print("Connected to DDE server, start listening...")
# 股票/期貨代號,名稱,時間,買進,賣出,成交,單量,總量,高點,低點,開盤
# dde.advise("FITXN*1.TF-preclose,Open,High,Low,TotalVolume", callback=fimtxnReciver)
# -F001,F002,F003,F004
dde.advise("FITXN*1.TF-1min-1", callback=fimtxnReciver)
PyWinDDE.WinMSGLoop()



  