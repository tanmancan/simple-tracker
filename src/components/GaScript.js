import React, { Component } from 'react';

/**
 * Component for including Google Analytics scripts
 *
 * @export
 * @class GaScript
 * @extends {Component}
 */
export default class GaScript extends Component {
  constructor(props) {
    super(props);
    this.gaTag = React.createRef();
  }

  /**
   * Loads GA script if UAID is provided via an environment variable - REACT_APP_GA
   *
   * @memberof GaScript
   */
  componentDidMount() {
    if (process.env['REACT_APP_GA']) {
      const gaId = process.env['REACT_APP_GA'];
      const gaScript = document.createElement('script');

      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      gaScript.onload = () => {
        const dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', process.env['REACT_APP_GA']);
      }

      this.gaTag.current.appendChild(gaScript);
    }
  }

  render() {
    return <div className="ga-tag" ref={this.gaTag}></div>
  }
}
