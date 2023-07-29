FROM mcr.microsoft.com/devcontainers/rust:1-1-bullseye

USER root

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y gcc-mingw-w64-x86-64 python

RUN apt-get install -y nodejs npm
RUN npm install -g typescript@4.3.5 p5 webpack webpack-cli webpack-dev-server ts-loader

RUN rustup target add x86_64-pc-windows-gnu 

USER vscode