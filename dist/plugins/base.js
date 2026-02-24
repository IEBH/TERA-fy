/**
* Base TeraFy plugin interface
* This is included as a documentation exanple only
*
* @class TeraFyPlugin
*/
export default class TeraFyPlugin {
    /**
    * Optional function to be included when the main TeraFyClient is initalized
    */
    init() { }
    /**
    * Instance constructor
    *
    * @param {TeraFy} terafy The TeraFy client this plugin is being initalized against
    * @param {Object} [options] Additional options to mutate behaviour
    */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(terafy, options) {
    }
}
//# sourceMappingURL=base.js.map