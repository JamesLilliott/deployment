#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { UtilitiesStack } = require('../lib/.utilities-stack');

const app = new cdk.App();
new UtilitiesStack(app, 'UtilitiesStack');