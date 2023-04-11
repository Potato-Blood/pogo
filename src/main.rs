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
    let pt = make_printer_thread(rx.clone());
    let wst = make_websocket_server_thread(rx);

    lt.join().unwrap();
    pt.join().unwrap();
    wst.join().unwrap();
}

fn make_listener_thread(
    tx: mpsc::Sender<String>,
) -> JoinHandle<core::result::Result<(), ListenError>> {
    let listener_thread = thread::spawn(move || {
        rlisten(move |event| match event.event_type {
            rdev::EventType::MouseMove { x, y } => {
                let r: u8 = 75;
                let old_min = 0.0;
                let old_max = 5140.0;
                let new_min = 0.0;
                let new_max = 255.0;
                let scaled_value =
                    (x - old_min) * (new_max - new_min) / (old_max - old_min) + new_min;
                let g: u8 = scaled_value as u8;
                let old_min = 0.0;
                let old_max = 1440.0;
                let new_min = 0.0;
                let new_max = 255.0;
                let scaled_value =
                    (x - old_min) * (new_max - new_min) / (old_max - old_min) + new_min;
                let b: u8 = scaled_value as u8;
                let msg = format!("Hack: {} {} {}", r, g, b);
                tx.send(msg).unwrap();
            }
            (_) => {
                let msg = format!("{:?}", event);
                tx.send(msg).unwrap();
            }
        })
    });

    return listener_thread;
}

fn make_printer_thread(rx: Arc<Mutex<mpsc::Receiver<String>>>) -> JoinHandle<()> {
    let printer_thread = thread::spawn(move || loop {
        let message = rx.lock().unwrap().recv().unwrap();
        println!("{}", message);
    });

    return printer_thread;
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
