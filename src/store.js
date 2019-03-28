/* global process */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

	state: {
		tracks: [
      { id: 0, name: 'Sunny9', artist: 'bela.bar', duration: '4 : 17' },
      { id: 1, name: 'Y=MX+B', artist: 'Peppy & The Firing Squad', duration: '3 : 22' },
      { id: 2, name: '2D', artist: 'Seed A.I.', duration: '5 : 33' }
    ],
    fields: ['name', 'artist', 'duration'],
    visibleTracks: [
      { id: 0, name: 'Sunny9', artist: 'bela.bar', duration: '4 : 17' },
      { id: 1, name: 'Y=MX+B', artist: 'Peppy & The Firing Squad', duration: '3 : 22' },
      { id: 2, name: '2D', artist: 'Seed A.I.', duration: '5 : 33' }
    ],
    currentTrackId: 0,
    currentProgress: 0,
    trackDuration: 0,
    maxProgress: 100,
    volume: 50,
		isPlaying: false,
		isMuted: false
	},
	getters: {
		currentTrackId: state => state.currentTrackId,
		fields: state => state.fields,
		currentTrackPath: state => './tracks/' +
			state.tracks[state.currentTrackId].artist + ' - ' +
			state.tracks[state.currentTrackId].name + '.mp3',
		currentTrackName: state => state.tracks[state.currentTrackId].artist +
			' - ' + state.tracks[state.currentTrackId].name,
		currentProgress: state => state.currentProgress,
		currentProgressInPixels: (state, getters) => {
			let pixelsInSeconds = getters.maxProgress/getters.trackDuration;
			return parseInt(getters.currentProgress * pixelsInSeconds);
		},
		currentProgressInMinutes: (state, getters) => {
				let minutes = parseInt(getters.currentProgress / 60);
				let seconds;
				minutes < 1 ? seconds = parseInt(getters.currentProgress) :
					seconds = parseInt(getters.currentProgress % (minutes*60));
				return minutes + ' : ' + seconds;
		},
		trackDuration: state => state.trackDuration,
		isPlaying: state => state.isPlaying,
		isMuted: state => state.isMuted,
		visibleTracks: state => state.visibleTracks,
		progress: state => state.progress,
		maxProgress: state => state.maxProgress,
		volume: state => state.volume
	},
	mutations: {
		changePlayerState(state, condition){
			state.isPlaying = condition;
		},
		setMute(state, condition){
			state.isMuted = condition;
		},
		setTrackDuration(state, duration){
			state.trackDuration = parseInt(duration);
		},
		setVolume(state, e){
			state.volume = e.layerX;
		},
		listInit(state){
			state.maxProgress = $('#progress').width();
			state.visibleTracks[0]._rowVariant = 'active';
		},
		findTrack(state, value){
			state.visibleTracks = state.tracks.filter(item => 
				item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
			);
			state.visibleTracks.forEach(item => {
				item.id === state.currentTrackId ? item._rowVariant = 'active' : false
			});
		},
		setCurrentTrack(state, index){
			for (var i = state.visibleTracks.length - 1; i >= 0; i--) {
				state.visibleTracks[i]._rowVariant = '';
				state.visibleTracks[i].duration = state.tracks[i].duration;
			}
			state.visibleTracks[index]._rowVariant = 'active';
			state.currentTrackId = state.visibleTracks[index].id;
		},
		setCurrentProgress(state, progress){
			state.currentProgress = progress;
		},
		setMaxProgress(state, maxProgress){
			state.maxProgress = maxProgress;
		},
		setCurrentProgressInMinutes(state, progress){
			let track = state.visibleTracks.find(item => item.id === state.currentTrackId);
			if (track) track.duration = progress;
		}
	},
	actions: {
		calcCurrentProgress(context, progress){
			context.commit('setMaxProgress', $('#progress').width());
			context.commit('setCurrentProgress', parseInt(progress));
			context.commit('setCurrentProgressInMinutes', context.getters.currentProgressInMinutes);
		},
		playPrevTrack(context){
			let nextTrack;
			context.state.currentTrackId === 0 ?
				nextTrack = context.state.tracks.length - 1 :
				nextTrack = context.state.currentTrackId - 1
			context.commit('setCurrentTrack', nextTrack);
		},
		playNextTrack(context){
			let nextTrack;
			context.state.currentTrackId === context.state.tracks.length - 1 ?
				nextTrack = 0 :
				nextTrack = context.state.currentTrackId + 1
			context.commit('setCurrentTrack', nextTrack);
		}
	},
	strict: process.env.NODE_ENV !== 'production'

});