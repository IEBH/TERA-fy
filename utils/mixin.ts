/**
* Shallow-copy a object instance and inject new properties into the result
*
* Rather ugly shallow-copy-of instance hack from https://stackoverflow.com/a/44782052/1295040
* Keeps the original object instance and overrides the given object of assignments
*
* @param {Object} instance Original object class instance to mixin
* @param {Object} assignments Additional object properties to mix
* @returns {Object} A shallow copy of the input instance extended with the assignments
*/
export default function mixin(instance: any, assignments: any) {
	const output = Object.assign(
		Object.create(Object.getPrototypeOf(instance)),
		instance,
		assignments,
	);
	return output;
}
