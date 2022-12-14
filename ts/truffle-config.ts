// vim: noexpandtab
'use strict';

/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 */

/**
 * The ".ethpm.json" file should have one of the following keys defined;
 *   - "private_keys"
 *   - "private_key"
 *   - "mnemonic"
 *
 * @see {link} https://next-stack.github.io/docs/getting_started/packages-ethpm
 *
 * ## Example `~/.ethpm.json`
 *
 * ```json
 * {
 *   "private_keys": [
 *     "deadbeef...",
 *     "123456..."
 *   ]
 * }
 * ```
 */

import dotenv from 'dotenv';
import { expand as dotenvExpand } from 'dotenv-expand';

import fs from 'fs';
import os from 'os';
import path from 'path';
import HDWalletProvider from '@truffle/hdwallet-provider';

import { loadJsonFileSync } from './js-lib/loadJsonFile';

const ethpm_file = `${path.join(os.homedir(), '.ethpm.json')}`;
let ethpm: { private_keys?: string[] };
if (fs.existsSync(ethpm_file)) {
	try {
		ethpm = loadJsonFileSync(ethpm_file);
	} catch (error) {
		console.warn('Warning: ignored ->', (error as Error).message);
	}
}

const { ENV_FILE = path.join(__dirname, '.env') } = process.env as {
	[key: string]: unknown;
	ENV_FILE?: string;
};
if (ENV_FILE?.length && fs.existsSync(ENV_FILE)) {
	dotenvExpand(dotenv.config({ path: ENV_FILE }));
}

//
module.exports = {
	/**
	 * Networks define how you connect to your ethereum client and let you set the
	 * defaults web3 uses to send transactions. If you don't specify one truffle
	 * will spin up a development blockchain for you on port 9545 when you
	 * run `develop` or `test`. You can ask a truffle command to use a specific
	 * network from the command line, e.g
	 *
	 * $ truffle test --network <network-name>
	 */

	networks: {
		// Useful for testing. The `development` name is special - truffle uses it by default
		// if it's defined here and no other network is specified at the command line.
		// You should run a client (like ganache-cli, geth or parity) in a separate terminal
		// tab if you use this network and you must also set the `host`, `port` and `network_id`
		// options below to some value.

		development: {
			host: '127.0.0.1', // Localhost (default: none)
			port: 8545, // Standard Ethereum port (default: none)
			network_id: '*', // Any network (default: none)
		},

		ethereum: {
			network_id: 1,
			confirmations: 1,
			timeoutBlocks: 100,
			provider: () => {
				const { INFURA_PROJECT_ID, PRIVATE_KEY } = process.env as {
					[key: string]: unknown;
					INFURA_PROJECT_ID?: string;
					PRIVATE_KEY?: string;
				};

				if (!INFURA_PROJECT_ID) {
					throw new Error('Missing `process.env.INFURA_PROJECT_ID`');
				}

				if (!PRIVATE_KEY) {
					throw new Error('Missing `process.env.PRIVATE_KEY`');
				}

				return new HDWalletProvider({
					privateKeys: [PRIVATE_KEY],
					providerOrUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
				});
			},
		},

		// Another network with more advanced options...
		// advanced: {
		// port: 8777,             // Custom port
		// network_id: 1342,       // Custom network
		// gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
		// gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
		// from: <address>,        // Account to send txs from (default: accounts[0])
		// websocket: true        // Enable EventEmitter interface for web3 (default: false)
		// },
		// Useful for deploying to a public network.
		// NB: It's important to wrap the provider as a function.
		// ropsten: {
		//   provider: () => {
		//     if (!ethpm) {
		//       throw new Error("Empty 'ethpm' file?");
		//     }
		//     if (!INFURA_PROJECT_ID) {
		//       throw new Error("Project ID is required");
		//     }
		//     const valid_keys = ["mnemonic", "private_key", "private_keys"];
		//     const auth_pair = Object.entries(ethpm).find(([key, value]) => {
		//       return valid_keys.includes(key);
		//     });
		//     if (!auth_pair || !auth_pair[1]) {
		//       throw new Error("Cannot find authentication within 'ethpm' file");
		//     }
		//     return new HDWalletProvider(
		//       auth_pair[1],
		//       `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`
		//     );
		//   },
		//   network_id: 3, // Ropsten's id
		//   gas: 5500000, // Ropsten has a lower block limit than mainnet
		//   confirmations: 2, // # of confs to wait between deployments. (default: 0)
		//   timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
		//   // skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		// },
		// Useful for private networks
		// private: {
		// provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
		// network_id: 2111,   // This network is yours, in the cloud.
		// production: true    // Treats this network as if it was a public net. (default: false)
		// }
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		reporter: 'eth-gas-reporter',
		reporterOptions: {
			coinmarketcap: process.env.API_COIN_MARKET_CAP,
			showTimeSpent: true,
			showMethodSig: true,
			excludeContracts: ['Migrations'],
		},
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: '0.8.7', // Fetch exact version from solc-bin (default: truffle's version)
			// docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 20_000,
				},
				//  evmVersion: "byzantium"
				outputSelection: {
					// /* File name to customize output for */
					// "*": {
					//   /* Contract name to configure */
					//   "": [
					//     "devdoc",
					//     "userdoc",
					//   ],
					// },
					'contracts/ExecutePermissions.sol': {
						'*': ['devdoc', 'userdoc'],
					},
					'contracts/interfaces/IExecutionPermissions.sol': {
						'*': ['devdoc', 'userdoc'],
					},
				},
			},
		},
	},

	// Truffle DB is currently disabled by default; to enable it, change enabled:
	// false to enabled: true. The default storage location can also be
	// overridden by specifying the adapter settings, as shown in the commented code below.
	//
	// NOTE: It is not possible to migrate your contracts to truffle DB and you should
	// make a backup of your artifacts to a safe location before enabling this feature.
	//
	// After you backed up your artifacts you can utilize db by running migrate as follows:
	// $ truffle migrate --reset --compile-all
	//
	// db: {
	// enabled: false,
	// host: "127.0.0.1",
	// adapter: {
	//   name: "sqlite",
	//   settings: {
	//     directory: ".db"
	//   }
	// }
	// }

	api_keys: {
		etherscan: ((): string | undefined => {
			const { ETHERSCAN_API_KEY } = process.env as {
				[key: string]: unknown;
				ETHERSCAN_API_KEY?: string;
			};

			if (!ETHERSCAN_API_KEY?.length) {
				console.warn('Warning -- missing `process.env.ETHERSCAN_API_KEY`');
			}

			return ETHERSCAN_API_KEY;
		})(),
	},

	plugins: ['truffle-contract-size', 'truffle-plugin-verify'],
};
