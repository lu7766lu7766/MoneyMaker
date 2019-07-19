import AdonisWS

ws = AdonisWS.Client("ws://localhost:3333/adonis-ws")

ws.subscripbe("DataCollect")
ws.send(event="join", message="tttt")
