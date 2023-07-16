use crate::utils::wait_ms;
use std::sync::mpsc;

use cpal::{
    traits::{DeviceTrait, HostTrait, StreamTrait},
    Device, Host,
};

const AUDIO_SAMPLE_DELAY_MS: u64 = 10;

// TODO: put this on it's own thread maybe?
pub fn make_listener(tx: mpsc::Sender<String>) {
    let host: Host = cpal::default_host();
    let device: Device = host.default_input_device().expect("No devices found");

    println!("Using default device. Name: {:?}", device.name());

    let supported_config = device
        .supported_input_configs()
        .expect("error while querying configs")
        .next()
        .expect("No support config?");

    println!("Successfully loaded configs for device");

    let data_callback = |listener: mpsc::Sender<String>| {
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
            data_callback(tx),
            move |err| println!("Error: {:?}", err.to_string()),
            None,
        )
        .unwrap();

    input_stream.play().unwrap();
}
