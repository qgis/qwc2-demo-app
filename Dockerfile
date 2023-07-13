# Build QWC2 and create map viewer service image

ARG QWC_MAP_VIEWER_VERSION=latest

FROM circleci/node:18 AS builder

WORKDIR /home/circleci
COPY --chown=circleci . .

RUN yarn install && yarn run prod


FROM sourcepole/qwc-map-viewer-base:$QWC_MAP_VIEWER_VERSION

COPY --from=builder --chown=$SERVICE_UID /home/circleci/prod /qwc2
