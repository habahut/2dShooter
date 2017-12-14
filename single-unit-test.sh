#!/bin/bash

mocha -r ts-node/register ts/tests/"$1"
