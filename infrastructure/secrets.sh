#!/bin/bash

echo "Creating secrets..."

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf