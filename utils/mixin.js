/**
* Mix additional properties into an object, inheriting from its prototype
* @param {Object} instance The instance to mixin into
* @param {Object} assignments Additional properties to assign
* @returns {Object} A new object inheriting from the instance prototype with merged properties
*/
export default function mixin(instance, assignments) {
	return Object.assign(
		Object.create(
			Object.getPrototypeOf(instance)
		),
		instance,
		assignments
	);
}
