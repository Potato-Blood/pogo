# Variables
BUILD_DIR := build

JS_SOURCE_DIR := front
JS_ASSETS_DIR := $(JS_SOURCE_DIR)/assets
JS_BUILD_DIR := $(BUILD_DIR)/client

RUST_SOURCE_DIR := back/src
RUST_DEBUG_DIR := back/target/debug
RUST_RELEASE_DIR := back/target/release
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
	cd $(RUST_SOURCE_DIR) && cargo build --release
	cp -r $(RUST_RELEASE_DIR) $(RUST_BUILD_DIR)

run: all
	$(RUST_EXECUTABLE)

serve:
	start http://localhost:$(SERVER_PORT) &
	make run &
	cd $(JS_BUILD_DIR) && python -m http.server $(SERVER_PORT) &

clean:
	rm -rf $(BUILD_DIR)
	rm -rf back/build
	cd $(RUST_SOURCE_DIR) && cargo clean

.PHONY: all js rust run serve clean