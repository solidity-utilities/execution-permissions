// vim: noexpandtab
'use strict';

import { ObjectEncodingOptions, OpenMode, readFileSync } from 'fs';
import { EventEmitter } from 'events';
import { readFile } from 'fs/promises';

/**
 * Asynchronously read and parse JSON file path
 * @param path Passed to `readFile` from 'fs/promises'
 * @param options Passed to `readFile` from 'fs/promises'
 * @param reciver Passed to `JSON.parse`
 */
function loadJsonFile(
	path: string,
	{
		options,
		reciver,
	}: {
		options?:
			| (ObjectEncodingOptions &
					EventEmitter.Abortable & {
						flag?: OpenMode | undefined;
					})
			| BufferEncoding
			| null;
		reciver?: (this: unknown, key: string, value: unknown) => unknown;
	} = {}
): Promise<Record<string, unknown>> {
	return readFile(path, options).then((value) => {
		return JSON.parse(value.toString(), reciver);
	});
}

/**
 * Synchronously read and parse JSON file path
 * @param path - Passed to `readFileSync` from 'fs'
 * @param options - Passed to `readFileSync` from 'fs'
 * @param reciver - Passed to `JSON.parse`
 */
function loadJsonFileSync(
	path: string,
	{
		options,
		reciver,
	}: {
		options?: {
			encoding?: null | undefined;
			flag?: string | undefined;
		};
		reciver?: (this: unknown, key: string, value: unknown) => unknown;
	} = {}
): Record<string, unknown> {
	const value = readFileSync(path, options).toString();
	return JSON.parse(value, reciver);
}

exports = module.exports = {
	loadJsonFile,
	loadJsonFileSync,
};

export { loadJsonFile, loadJsonFileSync };
