windows:
	cargo build --target x86_64-pc-windows-gnu --manifest-path ./back/Cargo.toml

tsproto:
	protoc --plugin="protoc-gen-ts=./front/node_modules/.bin/protoc-gen-ts"  --ts_out="./front/src/generated" --proto_path=./shared ./shared/event.proto

.PHONY: windows