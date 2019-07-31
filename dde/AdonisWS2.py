import websocket
try:
  import thread
except ImportError:
  import _thread as thread
import time
import json


def JSONstrigify(obj):
  return json.dumps(obj)

def JSONparse(str):
  return json.loads(str)

def on_message(ws, message):
    print("### message ### message:%s" % message)
    # res = JSONparse(message)
    # print(res)

def on_error(ws, error):
  print(error)

def on_close(ws):
  print("### closed ###")

def on_open(ws):
  print("### open ###")
  thread.start_new_thread(waiting, ())

ws = None
channel = None

def connect(host):
  global ws
  websocket.enableTrace(True)
  print("### construct ### host:%s" % host)
  ws = websocket.WebSocketApp(host,
                            on_message = on_message,
                            on_error = on_error,
                            on_close = on_close)
  ws.on_open = on_open
  # ws.recv()
  ws.run_forever()

def subscripbe(_channel):
  global ws, channel
  print("### subscripbe ###%s" % _channel)
  channel = channel
  ws.send(JSONstrigify({"t": 1, "d": {"topic": channel}}))
  # ws.recv()

def emit(event, data):
  global ws, channel
  print("### emit ### event:%s, message:%s" % (event, data))
  ws.send(JSONstrigify({
      "t": 7,
      "d": {
          "topic": channel,
          "event": event,
          "data": data
      }
  }))
  # result = ws.recv()
  # print("Received '%s'" % result)

def waiting():
  global ws
  while True:
    time.sleep(3)
    ws.send(JSONstrigify({"t":8}))
  # result = ws.recv()
  # print("Received '%s'" % result)
