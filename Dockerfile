FROM postgres:latest

ARG POSTGRES_PASSWORD=1234

ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}