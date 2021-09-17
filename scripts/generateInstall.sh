#! /usr/bin/env bash
set -x
set -o errexit
set -o nounset
set -o pipefail

KUSTOMIZE=kustomize

SRCROOT="$( CDPATH='' cd -- "$(dirname "$0")/.." && pwd -P )"
AUTOGENMSG="# This is an auto-generated file. DO NOT EDIT"

IMAGE_TAG=$(cat server/package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

$KUSTOMIZE version

cd ${SRCROOT}/k8s/manifests && $KUSTOMIZE edit set image gcr.io/keatproj/keat-server=gcr.io/keatproj/keat-server:${IMAGE_TAG}

echo "${AUTOGENMSG}" > "${SRCROOT}/k8s/install.yaml"
$KUSTOMIZE build "${SRCROOT}/k8s/manifests" >> "${SRCROOT}/k8s/install.yaml"
