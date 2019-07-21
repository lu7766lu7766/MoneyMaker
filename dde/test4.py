import AdonisWS2 as Websocket

Websocket.connect("ws://localhost:3333/adonis-ws")
print("hello")
Websocket.subscripbe("DataCollect")
Websocket.emit("test", "Helllooooooo")