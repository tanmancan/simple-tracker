import React, { Component } from 'react';

export default class ImportExportModal extends Component {
  constructor(props) {
    super(props);
    this.uploadFieldRef = React.createRef();
    this.handleFileSubmit = this.handleFileSubmit.bind(this);
    this.handleFileOnChange = this.handleFileOnChange.bind(this);
    this.state = {
      uploadFile: null,
      errorMessage: null,
      uploadHelpText: 'Click Choose File to uploaded a save file',
    }
  }

  handleFileOnChange(e) {
    const input = this.uploadFieldRef.current;
    const file = input.files[0];

    this.setState({
      uploadFile: file
    });
  }

  handleFileSubmit(e) {
    if (!this.state.uploadFile) {
      return;
    }
    const reader = new FileReader();

    reader.onload = this.handleReaderLoad.bind(this);
    reader.readAsText(this.state.uploadFile);
  }

  handleReaderLoad(e) {
    try {
      const data = JSON.parse(e.target.result);
      const savedState = data.savedState;
      const check = data.check;

      if (this.hash(JSON.stringify(savedState)) === check) {
        const confirmMsg = 'Are you sure you want to replace all current timer data with uploaded data?';
        if (window.confirm(confirmMsg)) {
          this.props.onRestoreGlobalState(savedState);
          this.setState({
            errorMessage: null,
          })
        }
      } else {
        this.restoreErrorMessage();
      }
    } catch(err) {
      this.restoreErrorMessage();
    }
  }

  restoreErrorMessage() {
    const errorMessage = 'Restore failed. Could not validate the saved file.';
    this.setState({
      errorMessage
    })
    window.alert(errorMessage);
  }

  // Credit: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  // Simple non secure method of verifying restore/download files
  hash(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  downloadData() {
    let downloadData = {
      savedState: this.props.getGlobalState,
      check: this.hash(JSON.stringify(this.props.getGlobalState))
    }
    const currentState = JSON.stringify(downloadData || '{}');
    const exportData = "data:text/json;charset=utf-8," + encodeURIComponent(currentState);
    return exportData;
  }

  formatExportName() {
    let dateOpt = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    let date = new Date();
    let formattedDate = date.toLocaleTimeString('en-US', dateOpt)
      .toLowerCase()
      .replace(/,|:|\sam$/g, '')
      .replace(/\s/g, '-');

    return `react-timer-save-${formattedDate}.json`;
  }

  render() {
    return (
      <div className="tag-import-export">
        <div id="modal-import-export" className="modal">
          <div className="modal-content">
            <div className="row">
                <h5>Import/Export Data</h5>
                <div className="section">
                  <h6>Save Current Data</h6>
                  <p>Download current timers, tags and categories. Running timers will not save their most recent progress – to insure all timers are up to date, stop timers before exporting data.</p>
                  <a
                    className="btn z-depth-0 light-blue"
                    download={this.formatExportName()}
                    href={this.downloadData()}>
                      <i className="material-icons left">cloud_download</i>
                    Download</a>
                </div>
                <div className="divider"></div>
                <div className="section row">
                  <h6>Restore Saved Data</h6>
                  <p>Upload previously downloaded data.</p>
                  <div className="input-field">
                    <p>
                      <input
                        id="file-upload"
                        ref={this.uploadFieldRef}
                        onChange={this.handleFileOnChange}
                        type="file" />
                    </p>
                    <span className="helper-text">
                      {(this.state.errorMessage)
                        ? <span className="red-text">{this.state.errorMessage}</span>
                        : <span>{this.state.uploadHelpText}</span>}
                    </span>
                </div>
                <button
                  disabled={!this.state.uploadFile}
                  onClick={this.handleFileSubmit}
                  className="btn red z-depth-0">
                  <i className="material-icons left">cloud_upload</i>Upload</button>
                </div>
                <div className="divider"></div>
            </div>

          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
          </div>
        </div>
      </div>
    );
  }
}
