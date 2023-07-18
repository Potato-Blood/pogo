use std::{
    sync::{mpsc, Arc, Mutex},
    thread::{self, JoinHandle},
};

use ws::{CloseCode, Handler, Handshake, Message, Result, Sender, WebSocket};

struct WebSocketHandler {
    out: Sender,
    rx: Arc<Mutex<mpsc::Receiver<String>>>,
}

impl Handler for WebSocketHandler {
    fn on_message(&mut self, _msg: Message) -> Result<()> {
        let message = self.rx.lock().unwrap().recv().unwrap();
        self.out.send(Message::text(message))
    }

    fn on_open(&mut self, shake: Handshake) -> Result<()> {
        println!("WebSocket opening for ({:?})", shake.peer_addr);
        self.out.send("hi")
    }

    fn on_close(&mut self, code: CloseCode, reason: &str) {
        println!("WebSocket closing for ({:?}) {}", code, reason);
    }
}

pub fn make_websocket_server_thread(rx: Arc<Mutex<mpsc::Receiver<String>>>) -> JoinHandle<()> {
    thread::spawn(move || {
        WebSocket::new(|out| WebSocketHandler {
            out,
            rx: rx.clone(),
        })
        .unwrap()
        .listen("localhost:9001")
        .unwrap();
    })
}
