import React, { Component } from 'react';

export default class Default extends Component {
  render() {
    return (
      <html lang="en">
        {'{% include head.html %}'}
          <body>
            { '{{ content }}'}
            <div id="root" />
          </body>
          <script src="{{site.ourl}}/assets/js/0.bundle.js" type="text/javascript" />
          <script src="{{site.ourl}}/assets/js/bundle.js" type="text/javascript" />
      </html>
    );
  }
}
