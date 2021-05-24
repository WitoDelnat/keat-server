#! /usr/bin/env bash
set -x
set -o errexit
set -o nounset
set -o pipefail

KUSTOMIZE=kustomize

SRCROOT="$( CDPATH='' cd -- "$(dirname "$0")/.." && pwd -P )"
AUTOGENMSG="# This is an auto-generated file. DO NOT EDIT"

IMAGE_TAG='latest'
# IMAGE_TAG=$(cat package.json \
#   | grep version \
#   | head -1 \
#   | awk -F: '{ print $2 }' \
#   | sed 's/[",]//g' \
#   | tr -d '[[:space:]]')

$KUSTOMIZE version

cd ${SRCROOT}/k8s/keat/instance && $KUSTOMIZE edit set image keat=keat:${IMAGE_TAG}

echo "${AUTOGENMSG}" > "${SRCROOT}/k8s/install.yaml"
$KUSTOMIZE build "${SRCROOT}/k8s/manifests" >> "${SRCROOT}/k8s/install.yaml"
