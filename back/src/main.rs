use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use rdev::{listen as rlisten, ListenError};

use std::time::{self, SystemTime};

use std::{
    sync::{mpsc, Arc, Mutex},
    thread::{self, JoinHandle},
};

const MAPPED_HEIGHT_MAX: f64 = 1080.0;
const MAPPED_WIDTH_MAX: f64 = 1920.0;
const AUDIO_SAMPLE_DELAY_MS: u64 = 10;

fn wait_ms(ms: u64) {
    let duration = time::Duration::from_millis(ms);
    thread::sleep(duration);
}

mod websockets {

    use std::{
        sync::{mpsc, Arc, Mutex},
        thread::{self, JoinHandle},
    };

    use ws::{CloseCode, Handler, Handshake, Message, Result, Sender as WsSender, WebSocket};

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
}

mod listeners {
    pub mod kbm_listener {
        use std::{
            sync::mpsc,
            thread::{self, JoinHandle},
            time::SystemTime,
        };

        use rdev::{listen, ListenError};

        pub fn make_listener_thread(
            tx: mpsc::Sender<String>,
            mapped_height_max: f64,
            mapped_width_max: f64,
        ) -> JoinHandle<core::result::Result<(), ListenError>> {
            thread::spawn(move || -> Result<(), ListenError> {
                let (monitor_width, monitor_height) = rdev::display_size().unwrap();
                let monitor_width = monitor_width as f64;
                let monitor_height = monitor_height as f64;
                let mut time_since_last_event = SystemTime::now();

                listen(move |event| match event.event_type {
                    rdev::EventType::MouseMove { x, y } => {
                        let time_now = SystemTime::now();
                        let diff_in_ms = time_now
                            .duration_since(time_since_last_event)
                            .unwrap()
                            .as_millis();

                        //TODO: make this configurable
                        if diff_in_ms <= 20 {
                            return;
                        }

                        let x = mapped_width_max / (monitor_width) * x;
                        let y = mapped_height_max / (monitor_height) * y;
                        let msg = format!("MouseMove: {} {}", x, y);

                        tx.send(msg).unwrap();
                        time_since_last_event = SystemTime::now();
                    }
                    rdev::EventType::KeyPress(_) => tx.send("KeyPress".to_owned()).unwrap(),
                    rdev::EventType::KeyRelease(_) => tx.send("KeyRelease".to_owned()).unwrap(),
                    rdev::EventType::ButtonPress(_) => tx.send("ButtonPress".to_owned()).unwrap(),
                    rdev::EventType::ButtonRelease(_) => {
                        tx.send("ButtonRelease".to_owned()).unwrap()
                    }
                    rdev::EventType::Wheel { delta_x, delta_y } => {
                        let msg = format!("WheelMove: {} {}", delta_x, delta_y);
                        tx.send(msg).unwrap();
                    }
                })
            })
        }
    }
}

use crate::listeners::kbm_listener::*;
use crate::websockets::*;

fn main() {
    println!("Starting Pogo...");

    let (tx, rx): (mpsc::Sender<String>, mpsc::Receiver<String>) = mpsc::channel();
    let rx = Arc::new(Mutex::new(rx));

    let host = cpal::default_host();

    let device = host
        .default_input_device()
        .expect("Oh no there's no devices D:");

    println!("Using default device. Name: {:?}", device.name());

    let mut supported_configs_range = device
        .supported_input_configs()
        .expect("error while querying configs");

    let supported_config = supported_configs_range
        .next()
        .expect("no supported config?!");

    println!("Successfully loaded configs for device");

    let handle_data = |listener: mpsc::Sender<String>| {
        move |data: &[f32], _: &cpal::InputCallbackInfo| {
            // data is an array of sound information. The for loop takes the first one then gives up
            for &sample in data {
                // println!("{:?}", sample); // USE THIS SAMPLE NUMBER
                // let mut open = false;
                if sample <= 10.0 {
                    listener.send("VoiceOff".to_owned()).unwrap();
                    // println!("{:?}", sample.abs()); // USE THIS SAMPLE NUMBER
                } else {
                    listener.send("VoiceOn".to_owned()).unwrap();
                    // println!("{:?}", sample.abs()); // USE THIS SAMPLE NUMBER
                }
                break;
            }
            wait_ms(AUDIO_SAMPLE_DELAY_MS)
        }
    };

    let input_stream = device
        .build_input_stream(
            &supported_config.with_max_sample_rate().config(),
            handle_data(tx.clone()),
            move |err| println!("Error! {:?}", err.to_string()),
            None,
        )
        .unwrap();

    input_stream.play().unwrap();

    let lt = make_listener_thread(tx, MAPPED_HEIGHT_MAX, MAPPED_WIDTH_MAX);
    println!("Keyboard Listener started");
    let wst = make_websocket_server_thread(rx);
    println!("Websocket Server started");

    lt.join().unwrap();
    wst.join().unwrap();

    loop {}
}
