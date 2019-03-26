import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

	state: {
		tracks: [
      { name: 'valve', artist: 'audiophyla', duration: '6:15' },
      { name: 'Sunny9', artist: 'bela.bar', duration: '4:17' },
      { name: 'Y=MX+B', artist: 'Peppy & The Firing Squad', duration: '3:22' },
      { name: '2D', artist: 'Seed A.I.', duration: '5:33' }
    ],
    visibleTracks: [
      { name: 'valve', artist: 'audiophyla', duration: '6:15' },
      { name: 'Sunny9', artist: 'bela.bar', duration: '4:17' },
      { name: 'Y=MX+B', artist: 'Peppy & The Firing Squad', duration: '3:22' },
      { name: '2D', artist: 'Seed A.I.', duration: '5:33' }
    ],
    progress: 10,
    maxProgress: 100,
    volume: 50,
		isPlaying: false,
		isMuted: false
	},
	getters: {
		isPlaying(state){
			return state.isPlaying;
		},
		isMuted(state){
			return state.isMuted;
		},
		visibleTracks(state){
			return state.visibleTracks;
		},
		progress(state){
			return state.progress;
		},
		maxProgress(state){
			return state.maxProgress;
		},
		volume(state){
			return state.volume;
		}
	},
	mutations: {
		setPlaying(state){
			state.isPlaying = !state.isPlaying;
		},
		setMute(state){
			state.isMuted = !state.isMuted;
		},
		findTrack(state, data){
			if (data.value !== '') {
				state.visibleTracks = []
			} else {
				state.visibleTracks = state.tracks
			}
		},
		setTrack(state, data){
			console.log(data.index);
		}
	},
	strict: process.env.NODE_ENV !== 'production'

});