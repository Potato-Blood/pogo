use std::{thread, time};
pub fn wait_ms(ms: u64) {
    let duration = time::Duration::from_millis(ms);
    thread::sleep(duration);
}
