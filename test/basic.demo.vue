<script>
import tera from '#tera-fy';

export default {
	data() { return {
		tera,
	}},
	created() {
		return tera.init();
	},
}
</script>

<template>
	<div>
		<div class="card">
			<div class="card-header">TERA messaging</div>
			<div class="card-body">
				<div class="list-group">
					<a @click="tera.send({action: 'handshake'})" class="list-group-item list-group-item-action">Handshake</a>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.list-group-item-action {
	cursor: pointer;
}
</style>
