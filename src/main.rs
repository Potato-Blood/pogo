use rdev::{listen as rlisten, ListenError};
use std::{
    sync::{mpsc, Arc, Mutex},
    thread::{self, JoinHandle},
};

use ws::{CloseCode, Handler, Handshake, Message, Result, Sender as WsSender, WebSocket};

fn main() {
    println!("Hello, world!");

    let (tx, rx): (mpsc::Sender<String>, mpsc::Receiver<String>) = mpsc::channel();
    let rx = Arc::new(Mutex::new(rx));

    let lt = make_listener_thread(tx);
    let wst = make_websocket_server_thread(rx);

    lt.join().unwrap();
    wst.join().unwrap();
}

fn make_listener_thread(
    tx: mpsc::Sender<String>,
) -> JoinHandle<core::result::Result<(), ListenError>> {
    let listener_thread = thread::spawn(move || {
        rlisten(move |event| match event.event_type {
            rdev::EventType::MouseMove { x, y } => {
                let msg = format!("Hack: {} {}", x, y);
                tx.send(msg).unwrap();
            }
            (_) => {
                tx.send("KeyPressed".to_owned()).unwrap();
            }
        })
    });

    return listener_thread;
}

struct WebSocketHandler {
    out: WsSender,
    rx: Arc<Mutex<mpsc::Receiver<String>>>,
}

impl Handler for WebSocketHandler {
    fn on_message(&mut self, msg: Message) -> Result<()> {
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

impl WebSocketHandler {
    fn bc(&mut self, msg: String) -> Result<()> {
        self.out.send(msg)
    }

    fn run(&mut self) -> Result<()> {
        loop {
            let message = self.rx.lock().unwrap().recv().unwrap();
            self.out.broadcast(Message::text(message))?;
        }
    }
}

fn make_websocket_server_thread(rx: Arc<Mutex<mpsc::Receiver<String>>>) -> JoinHandle<()> {
    let ws_thread = thread::spawn(move || {
        let server = WebSocket::new(|out| WebSocketHandler {
            out,
            rx: rx.clone(),
        })
        .unwrap()
        .listen("localhost:9001")
        .unwrap();
    });

    return ws_thread;
}
