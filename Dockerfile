FROM alpine:3.10.2

RUN apk update \
    && apk add tzdata \
    && apk add py-pip \
    && apk add bash \
    && apk add docker \
    && rm -rf /var/cache/apk/*

COPY ./app /srv/flask_app
COPY ./certs/ca.crt /usr/local/share/ca-certificates/ca.crt
ADD ./wrapdocker /usr/local/bin/wrapdocker

WORKDIR /srv/flask_app

RUN pip install --no-cache-dir -r ./requirements.txt --src /usr/local/src 

###### certificates
RUN update-ca-certificates

ENV REQUESTS_CA_BUNDLE=/usr/local/share/ca-certificates/ca.crt
#####

RUN chmod +x ./start.sh

ENV TZ=Asia/Almaty

LABEL Description="This image is used to synchronize docker registries" \
        Vendor="Novelty" \
        Version="1.0" \
        maintainer="eduard@novelty.kz"

CMD ["./start.sh"]
