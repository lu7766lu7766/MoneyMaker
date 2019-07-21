import AdonisWS
import time

ws = AdonisWS.Client("ws://localhost:3333/adonis-ws")
ws.subscripbe("DataCollect")
while True:
    time.sleep(1)
    ws.emit("test", "tttt")
