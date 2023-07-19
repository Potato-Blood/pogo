FROM mcr.microsoft.com/devcontainers/rust:1-1-bullseye

USER root

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install gcc-mingw-w64-x86-64 python -y

RUN rustup target add x86_64-pc-windows-gnu 

USER vscode