# deploy.sh
#! /bin/bash

BUCKET=$1

set -e

echo $GCLOUD_SERVICE_KEY | base64 --decode -i > ${HOME}/gcloud-service-key.json
export GOOGLE_APPLICATION_CREDENTIALS=${HOME}/gcloud-service-key.json

sudo /opt/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json

echo "Deploying to bucket: ${BUCKET}"

sudo /opt/google-cloud-sdk/bin/gsutil -m rsync -d -r build ${BUCKET}

# Set website up
sudo /opt/google-cloud-sdk/bin/gsutil web set -m index.html -e index.html ${BUCKET}

# Images
sudo /opt/google-cloud-sdk/bin/gsutil -m setmeta -h 'Cache-Control:public, max-age=31536000, no-transform' -r ${BUCKET}

# Content
sudo /opt/google-cloud-sdk/bin/gsutil -m setmeta -h 'Cache-Control:public, max-age=86400, no-transform' -r ${BUCKET}/static

# HTML
sudo /opt/google-cloud-sdk/bin/gsutil -m setmeta -h 'Cache-Control:no-cache' ${BUCKET}/*.html
