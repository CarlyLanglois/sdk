/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations
 * under the License.
 */

// inspired by: https://github.com/Viglino/ol3-games/blob/master/style/ol.style.sprite.js
import IconStyle from 'ol/style/icon';

class SdkSpriteStyle extends IconStyle {
  constructor(options) {
    const canvas = document.createElement('canvas');
    const width = canvas.width = options.width;
    const height = canvas.height = options.height;
    super({
      img: canvas,
      imgSize: [width, height],
      rotation: options.rotation,
      scale: options.scale
    });
    this.color = options.color;
    this.spriteCount = options.spriteCount;
    this.frameRate = options.frameRate !== undefined ? options.frameRate : 100;
    this.width = width;
    this.height = height;
    this.offset = [0,0];
    var img, self = this;
    img = this.img_ = new Image();
    img.crossOrigin = options.crossOrigin || "anonymous";
    img.src = options.src;
    if (img.width) {
      this.drawImage_();
    } else {
      img.onload = function() {
        self.drawImage_();
      };
    }
  }

  drawImage_() {
    const ctx = this.getImage().getContext("2d");

    if (this.color) {
      if (Array.isArray(this.color)) {
        ctx.shadowColor = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
      } else {
        ctx.shadowColor = this.color;
      }
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(
      this.img_,
      this.offset[0],
      this.offset[1],
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );
  }

  update(e) {
    const step = e.frameState.time / this.frameRate;
    const offset = [(0 + (Math.trunc(step)%this.spriteCount)) * this.width, 0];
    if (offset[0] !== this.offset[0] || offset[1] !== this.offset[1]) {
      this.offset = offset;
      this.drawImage_();
    }
  }
}

export default SdkSpriteStyle;
