<template>
	<section class="hello">
		<h2>{{ msg }}</h2>
		<slot />
	</section>
</template>

<script setup>
defineProps({
	msg: { type: String, default: 'Hello' }
})
</script>

<style scoped>
.hello {
	text-align: center;
}
</style>
