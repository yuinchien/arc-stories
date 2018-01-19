// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let host = 'TopStories';

  let storyTemplate = `
<style>
[story] {
  color: rgba(0,0,0,.87);
  display: flex;
  flex-direction: row;
  border-top: 1px solid rgba(0,0,0,.1);
  border-left: 1px solid rgba(0,0,0,.1);
  border-right: 1px solid rgba(0,0,0,.1);
  margin: 0 16px;
  padding: 16px;
}
[thumb] {
  width: 100px;
  height: 100px;
  margin-left: 16px;
  background-size: cover;
  background-position: 50% 50%;
  background-color: #eee;
  outline: 1px solid rgba(0,0,0,.1);
  outline-offset: -1px;
}

</style>
 <div story>
   <div style="flex:1;">
    <div style="font-size: 14px; line-height: 14px; color: rgba(0,0,0,.54); margin-bottom: 8px;">{{section}}</div>
    <div style="font-size: 18px; line-height: 26px;">{{title}}</div>
   </div>
   <div thumb style="{{imgStyle}}"></div>
 </div>
   `.trim();

  let template = `
<style>
  [${host}] {
    padding: 0px;
  }
  [${host}] [caption] {
    font-size: 32px;
    margin: 16px;
    padding-right: 80px;
    flex: 1;
  }
  [${host}] [logo] {
    width: 24px;
  }
  [logoWrapper] {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 16px;
  }
</style>
<div ${host}>
  <div logoWrapper>
    <img logo src="http://1000logos.net/wp-content/uploads/2017/04/Symbol-New-York-Times.png" />
    <div caption>Top Stories</div>
  </div>
  <template storys>${storyTemplate}</template>
  <div style="border-bottom: 1px solid rgba(0,0,0,.1);">{{storys}}</div>
</div>
    `.trim();

  return class extends DomParticle {

    constructor(props) {
      super(props);
      this._setState({data: []});
      this.httpRequest = null;
      this.makeRequest();
    }

    get template() {
      return template;
    }

    async makeRequest() {
      console.log('makeRequest');
      var url = "https://api.nytimes.com/svc/topstories/v2/home.json"+"?api-key=b7c19961dab74132b69551bfbc1cdf9f";

      let response = await fetch(url);
      let json = await response.json();
      console.log(json.results);
      this._setState({data: json.results});
    }

    _render(props, state) {
      return {
        storys: {
          $template: 'storys',
          models: state.data.map(story => {
            return {
              title: story.title,
              section: story.section,
              imgStyle: 'background-image:url('+ story.multimedia[ story.multimedia.length-1 ].url +');',
            };
          })
        }
      };

    }
  };

});
