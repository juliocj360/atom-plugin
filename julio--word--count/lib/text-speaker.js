/*global atom*/

const TextSpeakerView = require('./text-speaker-view')
const { CompositeDisposable } = require('atom')

module.exports = {

  textSpeakerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.textSpeakerView = new TextSpeakerView(state.textSpeakerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.textSpeakerView.getElement(),
      visible: false
    });

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'Text Speaker:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.textSpeakerView.destroy();
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide()
    }
    else {
      const editor = atom.workspace.getActiveTextEditor()
      const words = editor.getText()
      this.textSpeakerView.setCount(words)
      this.modalPanel.show()
    }
  }
};
