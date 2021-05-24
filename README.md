# Keat

Keat is the Kubernetes-native feature management tool.

**Problem:** "I want to increase my deployment frequency while keeping control of my stability."

**Solution:** Put your new code behind feature flags, which is safe to deploy - even when it's still an ongoing effort. Afterwards gradually increase the reach and recover from failures within minutes.

## Why Keat

Getting started with feature flags should be frictionless.

There should be no need for build vs buy discussions. Building takes time and makes you lose focus, while buying requires budget approval. Most often it's a non-technical decision which makes kickoff a bigger deal than it is.

There should be no need for operational discussions. Free off the shelf solutions often require stateful deployments which are an entry barrier. With Keat you can start small and let your feature management solution evolve over time.

Keat succeeds when adding it for feature management is as boring as adding [jest][jest] for tests or [dotenv][dotenv] for configuration.

## Installation

Install Keat server:

```bash
kubectl create namespace keat
kubectl apply -n keat -f https://raw.githubusercontent.com/WitoDelnat/keat-server/stable/k8s/install.yaml
```

This will add custom resource definitions and create a new namespace, keat, where Keat server will live.

## Getting started

Define your audience:

```yaml
# audience-developers.yaml
apiVersion: keat.io/v1alpha1
kind: Audience
metadata:
  name: developers
  labels:
    env: production
    app: blog
spec:
  kind: static
  members:
    - "developer@yourcompany.com"
```

Define your features:

```yaml
# feature-recommendations.yaml
apiVersion: keat.io/v1alpha1
kind: Feature
metadata:
  name: recommendations
spec:
  enabled: true
  audiences:
    - developers
---
apiVersion: keat.io/v1alpha1
kind: Feature
metadata:
  name: new-ui
spec:
  enabled: true
```

Apply them:

```bash
kubectl apply -n keat -f ./audience-example.yaml
kubectl apply -n keat -f ./feature-recommendations.yaml
```

That's it! You're all setup to [get started with Keat-node client][keat-node].

[keat-node]: https://github.com/WitoDelnat/keat-node#use-keat-server
