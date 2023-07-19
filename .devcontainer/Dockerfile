FROM mcr.microsoft.com/devcontainers/rust:1-1-bullseye

USER root

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install gcc-mingw-w64-x86-64 python -y

USER vscode