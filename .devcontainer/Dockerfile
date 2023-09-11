FROM node:20.6.1 as node

FROM mcr.microsoft.com/devcontainers/rust:1-1-bullseye

USER root

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y gcc-mingw-w64-x86-64 python

RUN rustup target add x86_64-pc-windows-gnu 

COPY --from=node /usr/local/bin/ /usr/local/bin/
COPY --from=node /usr/local/lib/ /usr/local/lib/
COPY --from=node /opt/ /opt/

USER vscode