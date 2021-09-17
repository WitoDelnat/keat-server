# Keat

Keat is the Kubernetes-native feature management tool.

**Problem:** "I want to increase my deployment frequency while keeping control of my stability."

**Solution:** Put your new code behind feature flags, which is safe to deploy. Afterwards gradually increase the reach and recover from failures within minutes.

## Installation

Install Keat server:

```bash
kubectl create namespace keat
kubectl apply -n keat -f https://raw.githubusercontent.com/WitoDelnat/keat-server/stable/k8s/install.yaml
```

This will add custom resource definitions and create a new namespace, keat, where Keat server will live.

## Getting started

Define your application:

```yaml
# application-demo.yaml
apiVersion: keat.io/v1alpha1
kind: Application
metadata:
  name: demo
spec:
  search: "everyone"
  chatbot: ["staff", 25]
```

Apply it:

```bash
kubectl apply -n keat -f ./application-demo.yaml
```

That's it! You're all setup to [remotely configure your Keat client][keat-node].

[keat-node]: https://github.com/WitoDelnat/keat-node#use-keat-server
