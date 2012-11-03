#!/usr/bin/env python
import tornado.web
import tornado.httpserver
import twitstream
from tornado import websocket
import os

GLOBALS={
    'sockets': []
}

(options, args) = twitstream.parser.parse_args()

options.engine = 'tornado'    
options.username = 'pdarche'
options.password = 'Morgortbort1!'


if len(args) < 1:
    twitstream.parser.error("requires one method argument")
else:
    method = args[0]
    if method not in twitstream.GETMETHODS and method not in twitstream.POSTPARAMS:
        raise NotImplementedError("Unknown method: %s" % method)

twitstream.ensure_credentials(options)

def testFunction(status):
    if "user" not in status:
        try:
            if options.debug:
                print >> sys.stderr, status
            return
        except:
            pass

    if len(GLOBALS['sockets']) > 0:
        GLOBALS['sockets'][0].write_message(status)
    # print "%s:\t%s\n" % (status.get('user', {}).get('screen_name'), status.get('text'))	


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        tmpl = os.path.join( os.path.dirname( __file__ ), '../templates/index.html' )
        tmplvars = {

            'title': 'Three App Engine'#,

        }
        self.render( tmpl )



class ClientSocket(websocket.WebSocketHandler):

    def open(self):
        GLOBALS['sockets'].append(self)
        print "WebSocket opened"

    def on_close(self):
        print "WebSocket closed"
        GLOBALS['sockets'].remove(self)

class Announcer(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        data = self.get_argument('data')
        for socket in GLOBALS['sockets']:
            socket.write_message(data)
        self.write('Posted')


stream = twitstream.twitstream(method, options.username, options.password, testFunction, 
            defaultdata=args[1:], debug=options.debug, engine=options.engine)

if __name__ == "__main__":

	app = tornado.web.Application(
		handlers = [
            (r"/", MainHandler),
            (r"/socket", ClientSocket),
            (r"/push", Announcer),
            # (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(os.path.dirname(file), "static")},), 
        ] 
	)
	http_server = tornado.httpserver.HTTPServer(app)
	http_server.listen(8000)
	stream.run()