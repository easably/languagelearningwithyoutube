import SubtitleStore from './SubtitlesStore'
import MainStore from './MainStore'
class store{
	constructor(){
		this.subtitles = new SubtitleStore();
		this.main = new MainStore();
	}
}
export default new store();