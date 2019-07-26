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

class Client:

  wait_secs = 5 # continue waiting secs

  def __init__(self, host):
    print("### construct - host: %s" % host)
    ws = websocket.WebSocket()
    ws.connect(host)
    self.__ws = ws
    result = self.__ws.recv()
    # print(result)
    thread.start_new_thread(self.waiting, ())

  def subscripbe(self, channel):
    print("### subscripbe - channel: %s" % channel)
    self.__channel = channel
    self.__ws.send(JSONstrigify({"t": 1, "d": {"topic": channel}}))
    result = self.__ws.recv()
    # print(result)

  def emit(self, event, data):
    print("### emit - event: %s, message: %s" % (event, data))
    self.__ws.send(JSONstrigify({
        "t": 7,
        "d": {
            "topic": self.__channel,
            "event": event,
            "data": data
        }
    }))
    # result = self.__ws.recv()
    # print("Received '%s'" % result)

  def waiting(self):
    while True:
      time.sleep(self.wait_secs)
      self.__ws.send(JSONstrigify({"t":8}))
      # result = self.__ws.recv()
      # print("Received '%s'" % result)
