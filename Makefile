# Variables
JS_SOURCE_DIR := .
JS_ASSETS_DIR := assets
JS_BUILD_DIR := build
RUST_SOURCE_DIR := src
RUST_BUILD_DIR := target/debug
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
	cargo build

run: all
	$(RUST_EXECUTABLE)

serve:
	make run &
	cd $(JS_BUILD_DIR) && python -m http.server $(SERVER_PORT)

clean:
	rm -rf $(JS_BUILD_DIR)
	cargo clean

.PHONY: all js rust run serve clean