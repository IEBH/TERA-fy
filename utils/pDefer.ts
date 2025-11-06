/* eslint-disable no-unused-vars */
/**
* Returns a defer object which represents a promise object which can resolve in the future - but without enclosing a function
* The defer object has the keys {promise, resolve(), reject()}
* @returns {Defer} A defered promise
*/

interface Defer {
  promise: Promise<unknown>;
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

/**
 * Default export
 * @returns Deferred promise
 */
export default function(): Defer {
	const deferred = {} as Defer;

	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});

	return deferred;
}