use std::io::Result;

fn main() -> Result<()> {
    prost_build::Config::new()
        .out_dir("src/generated/")
        .compile_protos(&["../shared/event.proto"], &["../shared/"])
        .unwrap();
    Ok(())
}