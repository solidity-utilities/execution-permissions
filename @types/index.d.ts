// vim: noexpandtab

/**
 * Additional type hints that _should_ reduce transpiler complaints
 */
export namespace Extended_Types {
	export namespace Truffle {
		export interface Revert {
			[key: string]: unknown;
			reason?: string;
		}
	}
}
