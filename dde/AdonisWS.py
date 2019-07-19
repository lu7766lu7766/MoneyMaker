import websocket
try:
  import thread
except ImportError:
  import _thread as thread
import time
import json


def JSONstrigify(json):
  return json.dumps(json, separators=(',', ': '))

def JSONparse(str):
  return json.loads(str)

class Client:
  def __init__(self, host):
    ws = websocket.WebSocket()
    ws.connect(host)
    ws.on_message = self.on_message
    ws.on_error = self.on_error
    ws.on_open = self.on_open
    ws.on_close = self.on_close
    self.__ws = ws

  def on_message(self, ws, message):
    # print(message)
    res = JSONparse(message)
    print(res)

  def on_error(self, ws, error):
    print(error)

  def on_close(self, ws):
	print("### closed ###")

  def on_open(self, ws):
    def run(*args):
		ws.send("Hello world")
		time.sleep(1)
    thread.start_new_thread(run, ())

  def subscripbe(self, channel):
    self.__channel = channel
    self.__ws.send(JSONstrigify({"t": 1, "d": {"topic": channel}}))

  def send(self, event, message):
    self.__ws.send(JSONstrigify({
        "t": 7,
        "d": {
            "topic": self.__channel,
            "event": event,
            "data": message
        }
    }))
