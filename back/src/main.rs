use std::sync::{mpsc, Arc, Mutex};

mod listeners;
mod utils;
mod websockets;
use crate::listeners::{gamepad_listener, kbm_listener, voice_listener};
use crate::websockets::*;

const MAPPED_HEIGHT_MAX: f64 = 1080.0;
const MAPPED_WIDTH_MAX: f64 = 1920.0;

fn main() {
    println!("Starting Pogo...");

    let (tx, rx): (mpsc::Sender<String>, mpsc::Receiver<String>) = mpsc::channel();
    let rx = Arc::new(Mutex::new(rx));

    let kbm_lt =
        kbm_listener::make_listener_thread(tx.clone(), MAPPED_HEIGHT_MAX, MAPPED_WIDTH_MAX);
    println!("Keyboard Listener started");

    voice_listener::make_listener(tx.clone());
    println!("Mic Listener started");

    let wst = make_websocket_server_thread(rx);
    println!("Websocket Server started");

    let controller_lt = gamepad_listener::make_listener_thread(tx.clone());
    println!("Controller listener started");

    kbm_lt.join().unwrap();
    controller_lt.join().unwrap();
    wst.join().unwrap();

    loop {}
}
