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
		tracks: state => state.tracks,
		visibleTracks: state => state.visibleTracks,
		currentTrackId: state => state.currentTrackId,
		fields: state => state.fields,
		currentTrackPath: state => './dist/tracks/' +
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
			// state.tracks.forEach((item, i) => Object.freeze(state.tracks[i]));
			state.visibleTracks[0]._rowVariant = 'active';
			console.log(state.tracks);
		},
		setCurrentProgress(state, progress){
			state.currentProgress = progress;
		},
		setMaxProgress(state, maxProgress){
			state.maxProgress = maxProgress;
		},
		setCurrentProgressInMinutes(state, progress){
			state.visibleTracks.forEach(item => {
				item.id === state.currentTrackId ?
					item.duration = progress : item.duration = state.tracks[item.id].duration;
			});
		},
		setCurrentTrackId(state, trackId){
			console.log('setCurrentTrackId: ',trackId);
			state.currentTrackId = trackId;
		},
		setActiveTrack(state){
			console.log('setActiveTrack', state.tracks);
			state.visibleTracks.forEach(item => {
				item.id === state.currentTrackId ?
					item._rowVariant = 'active' : item._rowVariant = '';
			});
		},
		setVisibleTracks(state, visibleTracks){
			state.visibleTracks = visibleTracks;
			console.log('setVisibleTracks: ', visibleTracks);
		}
	},
	actions: {
		calcCurrentProgress(context, progress){
			context.commit('setMaxProgress', $('#progress').width());
			context.commit('setCurrentProgress', parseInt(progress));
			context.commit('setCurrentProgressInMinutes', context.getters.currentProgressInMinutes);
		},
		playPrevTrack(context){
			let nextTrackId;
			context.state.currentTrackId === 0 ?
				nextTrackId = context.state.tracks.length - 1 :
				nextTrackId = context.state.currentTrackId - 1;
			context.dispatch('setCurrentTrack', nextTrackId);
		},
		playNextTrack(context){
			let nextTrackId;
			context.state.currentTrackId === context.state.tracks.length - 1 ?
				nextTrackId = 0 :
				nextTrackId = context.state.currentTrackId + 1;
			context.dispatch('setCurrentTrack', nextTrackId);
		},
		setCurrentTrack(context, index){
			for (var i = context.state.visibleTracks.length - 1; i >= 0; i--) {
				context.state.visibleTracks[i]._rowVariant = '';
			}
			let trackId = context.state.visibleTracks[index].id;
			context.commit('setCurrentTrackId', trackId);
			context.dispatch('updateListState');
		},
		updateListState(context){
			context.commit('setActiveTrack');
		},
		findTrack(context, value){
			let visibleTracks = context.state.tracks.filter(item => 
				item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
			);
			context.commit('setVisibleTracks', visibleTracks);
		}
	},
	strict: process.env.NODE_ENV !== 'production'

});