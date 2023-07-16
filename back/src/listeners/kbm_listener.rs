// Keyboard & Mouse Listener

use std::{
    sync::mpsc,
    thread::{self, JoinHandle},
    time::SystemTime,
};

use rdev::{listen, ListenError};

// Given an MSPC::Sender<String>
// Create a thread that listens for mouse & keyboard inputs and returns those events to the the mspc::Reviever
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
            rdev::EventType::ButtonRelease(_) => tx.send("ButtonRelease".to_owned()).unwrap(),
            rdev::EventType::Wheel { delta_x, delta_y } => {
                let msg = format!("WheelMove: {} {}", delta_x, delta_y);
                tx.send(msg).unwrap();
            }
        })
    })
}
