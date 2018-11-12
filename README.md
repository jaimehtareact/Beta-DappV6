# AGI Beta Dapp
The Beta Dapp is work in progress. It has the landing page from mockup and integrated with https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/service

This Dapp allows you to browse the list of SingularityNET Agents from the https://ltgukzuuck.execute-api.us-east-1.amazonaws.com/stage/service and call them to provide a Service (not included in this version)
The Dapp uses the SingularityNET contracts deployed on the Kovan testnet.

To get Kovan AGI to use the Dapp you can use the official [SingularityNET AGI Faucet](https://faucet.singularitynet.io/).
To get Kovan ETH to pay for gas costs you should refer to [this repo](https://github.com/kovan-testnet/faucet).

## How to call a Service
Steps for Integration with service come later...

## Development instructions
* Install [Node.js and npm](https://nodejs.org/)
* `npm install` to get dependencies
* `npm run serve` to serve the application locally and watch source files for modifications

### Deployment instructions
* `npm run build` builds the application distributable files to the `dist` directory
* `npm run deploy`; the target S3 Bucket for the deployment and its region are specified as command line parameters in the package.json file npm script

### Additional commands
* `npm run build-analyze` shows the size of the application's bundle components; the original size, the parsed size (uglified + tree-shaken) and the gzipped size
* `npm run serve-dist` serves the `dist` directory locally
