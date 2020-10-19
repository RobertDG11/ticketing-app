#!/bin/bash

echo "Creating secrets..."

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_51HdyUIJ4vJKOM1V6V29iFD9TVhqgpebEtIpKEpQBWrnoumyoJ6WWSjctJ3sdsKIMLDMDmIxwrpKDOych0gAqqC3O00MladrLs7