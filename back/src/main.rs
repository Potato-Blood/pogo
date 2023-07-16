use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::{mpsc, Arc, Mutex};

mod listeners;
mod utils;
mod websockets;
use crate::listeners::kbm_listener::*;
use crate::utils::*;
use crate::websockets::*;

const MAPPED_HEIGHT_MAX: f64 = 1080.0;
const MAPPED_WIDTH_MAX: f64 = 1920.0;
const AUDIO_SAMPLE_DELAY_MS: u64 = 10;

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
