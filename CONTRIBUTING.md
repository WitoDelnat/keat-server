# Contributing

## Create release

1. Set new version in package.json

```
vim server/package.json
```

2. Build new Kubernetes installation

```
./scripts/generateInstall.sh
```

3. Publish new image

```
docker build -t gcr.io/keatproj/keat-server:${NEW_VERSION} .
```

4. Commit changes and update next/stable changes if needed
