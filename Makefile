# Variables
BUILD_DIR := build
JS_SOURCE_DIR := .
JS_ASSETS_DIR := assets
JS_BUILD_DIR := $(BUILD_DIR)/client
RUST_SOURCE_DIR := src
RUST_DEBUG_DIR := target/debug
RUST_RELEASE_DIR := target/release
RUST_BUILD_DIR := $(BUILD_DIR)/server
RUST_EXECUTABLE := $(RUST_BUILD_DIR)/pogo
SERVER_PORT := 8000

# Targets
all: js rust

js:
	mkdir -p $(JS_BUILD_DIR)
	cp $(JS_SOURCE_DIR)/index.html $(JS_BUILD_DIR)/index.html
	cp $(JS_SOURCE_DIR)/sketch.js $(JS_BUILD_DIR)/sketch.js
	cp -r $(JS_ASSETS_DIR) $(JS_BUILD_DIR)

rust:
	cargo build --release
	cp -r $(RUST_RELEASE_DIR) $(RUST_BUILD_DIR)

run: all
	$(RUST_EXECUTABLE)

serve:
	start http://localhost:$(SERVER_PORT) &
	make run &
	cd $(JS_BUILD_DIR) && python -m http.server $(SERVER_PORT) &

clean:
	rm -rf $(BUILD_DIR)
	cargo clean

.PHONY: all js rust run serve clean