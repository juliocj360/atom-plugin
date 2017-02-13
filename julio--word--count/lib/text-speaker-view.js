'use babel';
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1')
const fs = require('fs')
const apiInfo = require('./server/key.js')
let clipCount = 0

export default class TextSpeakerView {

  constructor(serializedState) {
    this.element = document.createElement('div');
    this.element.classList.add('julio--word--count');
    this.element.setAttribute('id', 'word-box')

    const message = document.createElement('div');
    message.classList.add('message');
    this.element.appendChild(message);
  }

  serialize() {}

  destroy() {
    fs.unlinkSync(__dirname + `/test${clipCount}.ogg`)
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
  setCount(count) {
    if (clipCount > 0) {
      fs.unlinkSync(__dirname + `/test${clipCount}.ogg`)
    }
    clipCount += 1
    watsonPromise(count)
      .then(response => {
        const fileLoc = __dirname + `/test${clipCount}.ogg`
        const temp = fs.createWriteStream(fileLoc)
        response.pipe(temp)
      })
    const displayText = ''
    this.element.textContent = displayText
    const button = document.createElement('button')
    button.textContent = 'Speak to me'
    this.element.appendChild(button)
    button.addEventListener('click', audioLoader)
  }
}

const audioLoader = () => {
  const el = document.getElementById('word-box')
  const audio = document.createElement('audio')
  audio.style.display = 'none'
  el.appendChild(audio)
  const sourceTag = document.createElement('source')
  sourceTag.src = __dirname + `/test${clipCount}.ogg`
  audio.appendChild(sourceTag)
  audio.addEventListener('canplaythrough', () => {
    audio.play()
  })
}

const textToSpeech = new TextToSpeechV1(apiInfo)

const watsonPromise = (text) => {
  return new Promise((resolve, reject) => {
    const transcript = textToSpeech.synthesize({"text": text})
    !transcript ? reject(transcript) : resolve(transcript)
  })
}
