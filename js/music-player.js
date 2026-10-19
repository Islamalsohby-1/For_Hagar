export function createPondMusic(audioElement) {
  const isSupported =
    audioElement instanceof HTMLAudioElement &&
    audioElement.canPlayType('audio/ogg; codecs="vorbis"') !== '';

  if (!isSupported) {
    return {
      isSupported: false,
      toggle: async () => false
    };
  }

  audioElement.loop = true;
  audioElement.volume = 0.38;

  return {
    isSupported: true,
    async toggle() {
      if (!audioElement.paused) {
        audioElement.pause();
        return false;
      }

      await audioElement.play();
      return true;
    }
  };
}
