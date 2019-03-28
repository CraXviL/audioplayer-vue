<template>
	<b-container>
		<b-row class="my-3">
		  <b-col md="3" cols="6" 
		  				class="d-flex justify-content-between align-items-center order-1"
		  				>
		  	<img src="/img/back.svg" alt="back.svg" @click="playPrevTrack">
		  	<img v-if="!isPlaying"
		  				src="/img/play.svg"
		  				alt="play.svg"
		  				@click="changePlayerState">
		  	<img v-else="isPlaying"
		  				src="/img/pause.svg"
		  				alt="pause.svg"
		  				@click="changePlayerState">
		  	<img src="/img/next.svg" alt="next.svg" @click="playNextTrack">
		  </b-col>
		  <b-col md="6" cols="12"
		  				class="d-flex flex-column align-items-center order-md-2 order-3 p-0"
						  @click="onClickProgress"
						  >
				<h6>{{ currentTrackName }} {{ currentProgressInMinutes }}</h6>
		  	<b-progress id="progress"
		  							class="w-100"
		  							:value="currentProgressInPixels"
		  							:max="maxProgress"
		  							></b-progress>
		  </b-col>
		  <b-col md="3" cols="6" 
		  				class="d-flex align-items-center justify-content-center order-md-3 order-2"
		  				@click="onClickVolume"
		  				>
		  	<img v-if="!isMuted" 
		  				src="/img/volume.svg"
		  				alt="volume.svg"
		  				@click="onClickMute"
		  				>
		  	<img v-else="isMuted"
		  				src="/img/mute.svg"
		  				alt="mute.svg"
		  				@click="onClickMute"
		  				>
		  	<b-progress id="volume"
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
				<b-table hover thead-class="d-none" :items="visibleTracks" :fields="fields" @row-clicked="onClickList"/>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>

	import {mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
  	computed: mapGetters(['currentTrackId', 'currentProgress', 'currentProgressInPixels', 'currentProgressInMinutes', 'trackDuration', 'maxProgress', 'isPlaying', 'isMuted', 'volume', 'visibleTracks', 'fields', 'currentTrackPath', 'currentTrackName']),
  	methods: {
  		...mapMutations(['setMute', 'findTrack']),
  		...mapActions(['playPrevTrack', 'playNextTrack']),
  		changePlayerState() {
  			if (this.isPlaying) {
  				this.audioPlayer.pause();
  				this.$store.commit('changePlayerState', false);
  			} else {
  				this.audioPlayer.play();
  				this.$store.commit('changePlayerState', true);
  			}
  		},
			onClickProgress(e) {
				if (e.target.className === "progress-bar" || e.target.id === 'progress') {
					let pixelsInSeconds = this.maxProgress / this.trackDuration;
					let progressInSeconds = e.layerX / pixelsInSeconds
					this.$store.dispatch('calcCurrentProgress', progressInSeconds);
					this.audioPlayer.currentTime = progressInSeconds;
				}
			},
  		onClickVolume(e) {
  			if (e.target.className === "progress-bar" || e.target.id === 'volume') {
	  			this.$store.commit('setVolume', e);
	  			this.audioPlayer.volume = this.volume/100;
	  		}
  		},
  		onClickMute(e) {
  			if (this.isMuted) {
  				this.audioPlayer.muted = false;
  				this.$store.commit('setMute', false);
  			} else {
  				this.audioPlayer.muted = true;
  				this.$store.commit('setMute', true);
  			}
  		},
  		onClickList(e, index, item) {
  			if (this.visibleTracks[index]._rowVariant === 'active') this.changePlayerState();
  			else this.$store.commit('setCurrentTrack', index);
  		}
  	},
  	mounted() {
			audioPlayerInit: {
				this.audioPlayer = new Audio();
			  this.audioPlayer.volume = this.volume/100;
				this.audioPlayer.src = this.currentTrackPath;
				console.log('audioPlayerInit: ', this.audioPlayer);
				this.$store.commit('listInit');
				$(this.audioPlayer).one('loadedmetadata', () => {
					console.log(this.audioPlayer, this.audioPlayer.duration);
					this.$store.commit('setTrackDuration', this.audioPlayer.duration);
				});
			}
			addIdsToTrs: {
				for (var i = 0; i <= this.visibleTracks.length - 1; i++) {
					$('tbody tr:nth-child(' + (i+1) + ')').attr('id', 'tr_' + i);
				}
			}
  	},
  	watch: {
  		isPlaying() {
				if (this.isPlaying) {
					window.tickId = window.setInterval(() => {
						if (this.currentProgress === this.trackDuration) {
							this.$store.dispatch('playNextTrack');
						}
						this.$store.dispatch('calcCurrentProgress', this.audioPlayer.currentTime);
					}, 1000);
				} else {
					window.clearInterval(window.tickId);
				}
  		},
  		currentTrackPath() {
				this.audioPlayer.pause();
				this.audioPlayer.src = this.currentTrackPath;
				$(this.audioPlayer).one('loadeddata', () => this.audioPlayer.play());
				$(this.audioPlayer).one('loadedmetadata', () => {
					console.log(this.audioPlayer, this.audioPlayer.duration);
					this.$store.commit('setTrackDuration', this.audioPlayer.duration);
				});
				this.$store.commit('changePlayerState', true);
  		}
  	}
  };

</script>

<style lang="sass">

	@import 'style'

</style>