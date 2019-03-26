<template>
	<b-container>
		<b-row class="my-3">
		  <b-col md="3" cols="6" class="d-flex justify-content-between align-items-center order-1">
		  	<img src="/img/back.svg" alt="back.svg">
		  	<img v-if="isPlaying"
		  				src="/img/play.svg"
		  				alt="play.svg"
		  				@click="setPlaying">
		  	<img v-else="!isPlaying"
		  				src="/img/pause.svg"
		  				alt="pause.svg"
		  				@click="setPlaying">
		  	<img src="/img/next.svg" alt="next.svg">
		  </b-col>
		  <b-col md="6" cols="12" class="d-flex align-items-center order-sm-2 order-3">
		  	<b-progress id="progress"
		  							class="w-100"
		  							:value="progress"
		  							:max="maxProgress"
		  							></b-progress>
		  </b-col>
		  <b-col md="3" cols="6" class="d-flex align-items-center order-sm-3 order-2">
		  	<img v-if="!isMuted" 
		  				src="/img/volume.svg"
		  				alt="volume.svg"
		  				@click="setMute"
		  				>
		  	<img v-else="isMuted"
		  				src="/img/mute.svg"
		  				alt="mute.svg"
		  				@click="setMute"
		  				>
		  	<b-progress id="volume"
		  							class="w-100"
		  							:value="volume"
		  							:max="100"
		  							></b-progress>
		  </b-col>
		</b-row>
		<b-row class="my-3">
			<b-col>
				<b-form-input type="text" placeholder="Find track" @input="findTrack"/>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-table hover thead-class="d-none" :items="visibleTracks" @row-clicked="setTrack"/>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>

	import {mapGetters, mapMutations} from 'vuex';

  export default {
  	computed: mapGetters(['progress', 'maxProgress', 'isPlaying', 'isMuted', 'volume', 'visibleTracks']),
  	methods: {
  		...mapMutations(['setPlaying', 'setMute']),
  		findTrack(value) {
  			this.$store.commit('findTrack', {value});
  		},
  		setTrack(e, index, item) {
  			$(item.target).parents('tr').addClass('bg-info').siblings().removeClass('bg-info');
  			this.$store.commit('setTrack', {index});
  		}
  	}
  };

</script>

<style lang="sass">

	@import 'style'

</style>