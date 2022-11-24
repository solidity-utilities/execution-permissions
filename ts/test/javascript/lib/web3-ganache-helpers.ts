// vim: noexpandtab
'use strict';

/**
 * @file Ganache utility functions
 * @author S0AndS0
 *
 * @example
 * ```javascript
 * contract("<Contract_Name>.<Function_Name>", (accounts) => {
 *   let snapshot_id;
 *
 *   beforeEach(async () => {
 *     snapshot_id = (await takeSnapShot()).result;
 *   });
 *
 *   afterEach(async () => {
 *     await revertToSnapShot(snapshot_id);
 *   });
 * });
 * ```
 */

import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';

/**
 * Transmute `web3.currentProvider.send` into `Promise`
 */
function promisedWeb3Send(dict: JsonRpcPayload): Promise<JsonRpcResponse | undefined> {
	return new Promise((resolve, reject) => {
		if (web3.currentProvider == null || typeof web3.currentProvider === 'string') {
			return reject(new Error('promisedWeb3Send -> Missing `web3.currentProvider`'));
		}

		if (!web3.currentProvider.send) {
			return reject(new Error('promisedWeb3Send -> Missing `web3.currentProvider.send`'));
		}

		if (!dict || !Object.keys(dict).length) {
			return reject(new Error('promisedWeb3Send -> Missing `dict`'));
		}

		web3.currentProvider.send(dict, (error, result) => {
			if (error) {
				return reject(error);
			}
			return resolve(result);
		});
	});
}

/**
 * Save and return `.result` snapshot ID of blockchain state
 * @see {@link https://medium.com/fluidity/standing-the-time-of-test-b906fcc374a9}
 */
function takeSnapShot(): Promise<JsonRpcResponse | undefined> {
	return promisedWeb3Send({
		jsonrpc: '2.0',
		method: 'evm_snapshot',
		id: new Date().getTime(),
	});
}

/**
 * Restore blockchain state to given ID
 * Warning: saved state of IDs greater than what is provided will be discarded
 */
function revertToSnapShot(id: JsonRpcPayload['id']): Promise<JsonRpcResponse | undefined> {
	if (!id) {
		return Promise.reject(new Error('revertToSnapShot -> Missing `id`'));
	}

	return promisedWeb3Send({
		jsonrpc: '2.0',
		method: 'evm_revert',
		params: [id],
		id: new Date().getTime(),
	});
}

exports = module.exports = {
	promisedWeb3Send,
	takeSnapShot,
	revertToSnapShot,
};

export { promisedWeb3Send, takeSnapShot, revertToSnapShot };
