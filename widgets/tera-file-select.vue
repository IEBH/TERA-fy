<script>
/**
* Simple Vue widget to pick a project file via TERA-fy
* Most of the options are copied from the $teraFy.selectProjectFile() API call that this component wraps
* @see https://github.com/IEBH/TERA-fy
*
* @prop {Boolean} [save=false] Prompt for either a new filename or overwriting an existing file, if false only show files to open
* @prop {String} [saveFilename] Optional suggested filename when saving
*
* @prop {String} [title="Select a citation library"] The title of the file selection display
* @prop {String|Array<String>} [hint] Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage
* @prop {Boolean} [allowUpload=true] Allow uploading new files
* @prop {Boolean} [allowRefresh=true] Allow the user to manually refresh the file list
* @prop {Boolean} [allowDownloadZip=true] Allow the user to download a Zip of all files
* @prop {Boolean} [allowCancel=true] Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed
* @prop {Boolean} [autoRequire=true] Run `requireProject()` automatically before continuing
* @prop {FileFilters} [filters] Optional file filters, defaults to citation library selection only
*
* @prop {String} [placeholder="Select a file..."] Placeholder text to show when no file is selected
*
* @emits change Fired as `(file:ProjectFile)` when the contents changes
*
* @slot selected Slot to show when a file is selected. Contains the bindings `({selected})`
* @slot deselected Slot to show when no file is selected. Contains the bindings `({})`
*/
export default {
	emits: ['change'],
	data() { return {
		/**
		* The currently selected library, if any
		* @type {null|ProjectFile}
		*/
		selected: null,
	}},
	props: {
		// Props passed to $teraFy.selectProjectFile()
		save: {type: Boolean, default: false},
		saveFilename: {type: String},
		title: {type: String, default: 'Select a citation library'},
		hint: {type: [String, Array]},
		allowUpload: {type: Boolean, default: true},
		allowRefresh: {type: Boolean, default: true},
		allowDownloadZip: {type: Boolean, default: true},
		allowCancel: {type: Boolean, default: true},
		autoRequire: {type: Boolean, default: true},
		filters: {type: Object, default: ()=> ({
			library: true,
		})},

		// Props specific to this component
		placeholder: {type: String, default: 'Select a file...'},
	},
	methods: {
		/**
		* Trigger the file selection functionality within TERA-fy
		* This sets the `selected` data property to the newly selected file + fires @change
		*
		* @emits change Fired as `(file:ProjectFile)` when the contents changes
		* @returns {ProjectFile} file The selected file
		*/
		async choose() {
			this.selected = await this.$tera.selectProjectFile({
				save: this.save,
				saveFiename: this.saveFilename,
				title: this.title,
				hint: this.hint,
				allowUpload: this.allowUpload,
				allowRefresh: this.allowRefresh,
				allowDownloadZip: this.allowDownloadZip,
				allowCancel: this.allowCancel,
				autoRequire: this.autoRequire,
				filters: this.filters,
			});

			this.$emit('change', this.selected);
			return this.selected;
		},
	},
}
</script>

<template>
	<div
		class="tera-library-select"
		:class="selected && 'active'"
		@click="choose"
	>
		<slot v-if="selected" name="selected" :selected="selected">
			<a class="tera-library-select-selected">
				<div class="file-name">
					{{selected.parsedName.filename}}
				</div>
				<div class="file-meta">
					(last edit {{selected.modifiedFormatted}} / {{selected.sizeFormatted}})
				</div>
			</a>
		</slot>
		<slot v-else name="deselected">
			<a class="tera-library-select-deselected">
				<div class="file-placeholder">
					{{placeholder}}
				</div>
			</a>
		</slot>
	</div>
</template>

<style>
/* NOTE: This is basic, minimal CSS to maintain compatibility downstream - so no SCSS, just plain */

.tera-library-select {
	display: flex;
	align-items: center;
	justify-content: center;

	padding: 6px 10px;
	border-radius: 5px;
	width: 100%;
	border: 1px solid #ced4da;
	cursor: pointer;
	min-height: 55px;
}

.tera-library-select a {
	text-decoration: none;
	color: inherit;
}

.tera-library-select a:hover {
	text-decoration: none;
}

.tera-library-select.active {
	border-color: #28a745;
}

.tera-library-select:hover .file-name,
.tera-library-select:hover .file-placeholder {
	color: #0056b3;
}

.tera-library-select .file-meta {
	font-size: xx-small;
}
</style>
