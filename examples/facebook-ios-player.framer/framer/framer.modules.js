require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"bars":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Bars = (function(superClass) {
  extend(Bars, superClass);

  function Bars(options) {
    var bar, bars, barsColor, barsHeight, barsPadding, barsWidth, i, j, ref;
    if (options == null) {
      options = {};
    }
    bars = options.bars ? options.bars : 3;
    barsHeight = options.barHeight ? options.barHeight : 25;
    barsWidth = options.barWidth ? options.barWidth : 6;
    barsPadding = options.barPadding ? options.barPadding : 3;
    barsColor = options.barColor ? options.barColor : "#fff";
    Bars.__super__.constructor.call(this, {
      height: barsHeight,
      width: (barsWidth + barsPadding) * bars,
      backgroundColor: null
    });
    for (i = j = 1, ref = bars; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      bar = new Layer({
        superLayer: this,
        width: barsWidth,
        height: barsHeight,
        backgroundColor: barsColor,
        x: (barsWidth + barsPadding) * (i - 1),
        originY: 1
      });
      this.animateDown(bar);
    }
  }

  Bars.prototype.animateUp = function(target) {
    var animation, rand, scale, time;
    rand = Utils.randomNumber(1, 10);
    time = Utils.round(rand / 20, 2);
    scale = Utils.round(1 - rand / 10, 2);
    animation = new Animation({
      layer: target,
      properties: {
        scaleY: scale
      },
      time: time
    });
    animation.on(Events.AnimationEnd, (function(_this) {
      return function() {
        return _this.animateDown(target);
      };
    })(this));
    return animation.start();
  };

  Bars.prototype.animateDown = function(target) {
    var animation, rand, scale, time;
    rand = Utils.randomNumber(1, 10);
    time = Utils.round(rand / 20, 2);
    scale = Utils.round(rand / 10, 2);
    animation = new Animation({
      layer: target,
      properties: {
        scaleY: time
      },
      time: time
    });
    animation.on(Events.AnimationEnd, (function(_this) {
      return function() {
        return _this.animateUp(target);
      };
    })(this));
    return animation.start();
  };

  return Bars;

})(Layer);


},{}],"videoplayer":[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.VideoPlayer = (function(superClass) {
  extend(VideoPlayer, superClass);

  function VideoPlayer(options) {
    var bindTo;
    if (options == null) {
      options = {};
    }
    this.setPauseButtonImage = bind(this.setPauseButtonImage, this);
    this.setPlayButtonImage = bind(this.setPlayButtonImage, this);
    this.setTimeTotal = bind(this.setTimeTotal, this);
    this.setTimeLeft = bind(this.setTimeLeft, this);
    this.videoLayer = null;
    this.playButton = null;
    this.progessBar = null;
    this.timeElapsed = null;
    this.timeLeft = null;
    this.timeTotal = null;
    this._currentlyPlaying = null;
    this._shyPlayButton = null;
    this._shyControls = null;
    this._isScrubbing = null;
    this._showProgress = null;
    this._showTimeElapsed = null;
    this._showTimeLeft = null;
    this._showTimeTotal = null;
    this._controlsArray = [];
    this.playimage = "images/play.png";
    this.pauseimage = "images/pause.png";
    if (options.playButtonDimensions == null) {
      options.playButtonDimensions = 80;
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "#000";
    }
    if (options.width == null) {
      options.width = 480;
    }
    if (options.height == null) {
      options.height = 270;
    }
    if (options.fullscreen) {
      options.width = Screen.width;
      options.height = Screen.height;
    }
    VideoPlayer.__super__.constructor.call(this, {
      width: options.width,
      height: options.height,
      backgroundColor: null
    });
    this.videoLayer = new VideoLayer({
      width: options.width,
      height: options.height,
      superLayer: this,
      backgroundColor: options.backgroundColor,
      name: "videoLayer"
    });
    if (options.autoplay) {
      this.videoLayer.player.autoplay = true;
    }
    if (options.muted) {
      this.videoLayer.player.muted = true;
    }
    this.playButton = new Layer({
      width: options.playButtonDimensions,
      height: options.playButtonDimensions,
      superLayer: this.videoLayer,
      backgroundColor: null,
      name: "playButton"
    });
    this.playButton.showPlay = (function(_this) {
      return function() {
        return _this.playButton.image = _this.playimage;
      };
    })(this);
    this.playButton.showPause = (function(_this) {
      return function() {
        return _this.playButton.image = _this.pauseimage;
      };
    })(this);
    this.playButton.showPlay();
    this.playButton.center();
    bindTo = options.constrainToButton ? this.playButton : this.videoLayer;
    bindTo.on(Events.Click, (function(_this) {
      return function() {
        var i, layer, len, ref, results;
        if (_this.videoLayer.player.paused) {
          _this.emit("controls:play");
          _this._currentlyPlaying = true;
          _this.videoLayer.player.play();
          if (_this._shyPlayButton) {
            _this.fadePlayButton();
          }
          if (_this._shyControls) {
            return _this.fadeControls();
          }
        } else {
          _this.emit("controls:pause");
          _this._currentlyPlaying = false;
          _this.videoLayer.player.pause();
          _this.playButton.animateStop();
          _this.playButton.opacity = 1;
          ref = _this._controlsArray;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            layer = ref[i];
            layer.animateStop();
            results.push(layer.opacity = 1);
          }
          return results;
        }
      };
    })(this));
    Events.wrap(this.videoLayer.player).on("pause", (function(_this) {
      return function() {
        _this.emit("video:pause");
        if (!_this._isScrubbing) {
          return _this.playButton.showPlay();
        }
      };
    })(this));
    Events.wrap(this.videoLayer.player).on("play", (function(_this) {
      return function() {
        _this.emit("video:play");
        return _this.playButton.showPause();
      };
    })(this));
    Events.wrap(this.videoLayer.player).on("ended", (function(_this) {
      return function() {
        var i, layer, len, ref, results;
        _this.emit("video:ended");
        _this._currentlyPlaying = false;
        _this.videoLayer.player.pause();
        _this.playButton.animateStop();
        if (_this._shyControls) {
          _this.playButton.opacity = 1;
          ref = _this._controlsArray;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            layer = ref[i];
            layer.animateStop();
            results.push(layer.opacity = 1);
          }
          return results;
        }
      };
    })(this));
    this.videoLayer.video = options.video;
    this.timeStyle = {
      "font-size": "20px",
      "color": "#000"
    };
    this.videoLayer.formatTime = function() {
      var min, sec;
      sec = Math.floor(this.player.currentTime);
      min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      sec = sec >= 10 ? sec : "0" + sec;
      return min + ":" + sec;
    };
    this.videoLayer.formatTimeLeft = function() {
      var min, sec;
      sec = Math.floor(this.player.duration) - Math.floor(this.player.currentTime);
      min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      sec = sec >= 10 ? sec : "0" + sec;
      return min + ":" + sec;
    };
  }

  VideoPlayer.define("video", {
    get: function() {
      return this.videoLayer.player.src;
    },
    set: function(video) {
      return this.videoLayer.player.src = video;
    }
  });

  VideoPlayer.define("showProgress", {
    get: function() {
      return this._showProgress;
    },
    set: function(showProgress) {
      return this.setProgress(showProgress);
    }
  });

  VideoPlayer.define("showTimeElapsed", {
    get: function() {
      return this._showTimeElapsed;
    },
    set: function(showTimeElapsed) {
      return this.setTimeElapsed(showTimeElapsed);
    }
  });

  VideoPlayer.define("showTimeLeft", {
    get: function() {
      return this._showTimeLeft;
    },
    set: function(showTimeLeft) {
      return this.setTimeLeft(showTimeLeft);
    }
  });

  VideoPlayer.define("showTimeTotal", {
    get: function() {
      return this._showTimeTotal;
    },
    set: function(showTimeTotal) {
      return this.setTimeTotal(showTimeTotal);
    }
  });

  VideoPlayer.define("shyPlayButton", {
    get: function() {
      return this._shyPlayButton;
    },
    set: function(shyPlayButton) {
      return this.setShyPlayButton(shyPlayButton);
    }
  });

  VideoPlayer.define("shyControls", {
    get: function() {
      return this._shyControls;
    },
    set: function(shyControls) {
      return this.setShyControls(shyControls);
    }
  });

  VideoPlayer.define("playButtonImage", {
    get: function() {
      return this.playimage;
    },
    set: function(playButtonImage) {
      return this.setPlayButtonImage(playButtonImage);
    }
  });

  VideoPlayer.define("pauseButtonImage", {
    get: function() {
      return this.pauseimage;
    },
    set: function(pauseButtonImage) {
      return this.setPauseButtonImage(pauseButtonImage);
    }
  });

  VideoPlayer.define("player", {
    get: function() {
      return this.videoLayer.player;
    }
  });

  VideoPlayer.prototype.setProgress = function(showProgress) {
    this._showProgress = showProgress;
    this.progressBar = new SliderComponent({
      width: 440,
      height: 10,
      knobSize: 40,
      backgroundColor: "#ccc",
      min: 0,
      value: 0,
      name: "progressBar"
    });
    this._controlsArray.push(this.progressBar);
    this.progressBar.knob.draggable.momentum = false;
    Events.wrap(this.videoLayer.player).on("canplay", (function(_this) {
      return function() {
        return _this.progressBar.max = Math.round(_this.videoLayer.player.duration);
      };
    })(this));
    Events.wrap(this.videoLayer.player).on("timeupdate", (function(_this) {
      return function() {
        return _this.progressBar.knob.midX = _this.progressBar.pointForValue(_this.videoLayer.player.currentTime);
      };
    })(this));
    this.progressBar.on("change:value", (function(_this) {
      return function() {
        if (_this._currentlyPlaying) {
          return _this.videoLayer.player.currentTime = _this.progressBar.value;
        }
      };
    })(this));
    this.progressBar.knob.on(Events.DragStart, (function(_this) {
      return function() {
        _this._isScrubbing = true;
        if (_this._currentlyPlaying) {
          return _this.videoLayer.player.pause();
        }
      };
    })(this));
    return this.progressBar.knob.on(Events.DragEnd, (function(_this) {
      return function() {
        _this._isScrubbing = false;
        _this.videoLayer.player.currentTime = _this.progressBar.value;
        if (_this._currentlyPlaying) {
          return _this.videoLayer.player.play();
        }
      };
    })(this));
  };

  VideoPlayer.prototype.setShyPlayButton = function(shyPlayButton) {
    return this._shyPlayButton = shyPlayButton;
  };

  VideoPlayer.prototype.fadePlayButton = function() {
    return this.playButton.animate({
      properties: {
        opacity: 0
      },
      time: 2
    });
  };

  VideoPlayer.prototype.setShyControls = function(shyControls) {
    return this._shyControls = shyControls;
  };

  VideoPlayer.prototype.fadeControls = function() {
    var i, index, layer, len, ref, results;
    ref = this._controlsArray;
    results = [];
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      layer = ref[index];
      results.push(layer.animate({
        properties: {
          opacity: 0
        },
        time: 2
      }));
    }
    return results;
  };

  VideoPlayer.prototype.setTimeElapsed = function(showTimeElapsed) {
    this._showTimeElapsed = showTimeElapsed;
    if (showTimeElapsed === true) {
      this.timeElapsed = new Layer({
        backgroundColor: "transparent",
        name: "currentTime"
      });
      this._controlsArray.push(this.timeElapsed);
      this.timeElapsed.style = this.timeStyle;
      this.timeElapsed.html = "0:00";
      return Events.wrap(this.videoLayer.player).on("timeupdate", (function(_this) {
        return function() {
          return _this.timeElapsed.html = _this.videoLayer.formatTime();
        };
      })(this));
    }
  };

  VideoPlayer.prototype.setTimeLeft = function(showTimeLeft) {
    this._showTimeLeft = showTimeLeft;
    if (showTimeLeft === true) {
      this.timeLeft = new Layer({
        backgroundColor: "transparent",
        name: "timeLeft"
      });
      this._controlsArray.push(this.timeLeft);
      this.timeLeft.style = this.timeStyle;
      this.timeLeft.html = "-0:00";
      Events.wrap(this.videoLayer.player).on("loadedmetadata", (function(_this) {
        return function() {
          return _this.timeLeft.html = "-" + _this.videoLayer.formatTimeLeft();
        };
      })(this));
      return Events.wrap(this.videoLayer.player).on("timeupdate", (function(_this) {
        return function() {
          return _this.timeLeft.html = "-" + _this.videoLayer.formatTimeLeft();
        };
      })(this));
    }
  };

  VideoPlayer.prototype.setTimeTotal = function(showTimeTotal) {
    this._showTimeTotal = showTimeTotal;
    if (showTimeTotal === true) {
      this.timeTotal = new Layer({
        backgroundColor: "transparent",
        name: "timeTotal"
      });
      this._controlsArray.push(this.timeTotal);
      this.timeTotal.style = this.timeStyle;
      this.timeTotal.html = "0:00";
      return Events.wrap(this.videoLayer.player).on("loadedmetadata", (function(_this) {
        return function() {
          return _this.timeTotal.html = _this.videoLayer.formatTimeLeft();
        };
      })(this));
    }
  };

  VideoPlayer.prototype.setPlayButtonImage = function(image) {
    this.playimage = image;
    this.playButton.image = image;
    return this.playButton.showPlay = function() {
      return this.image = image;
    };
  };

  VideoPlayer.prototype.setPauseButtonImage = function(image) {
    this.pauseimage = image;
    return this.playButton.showPause = function() {
      return this.image = image;
    };
  };

  return VideoPlayer;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamF5c3Rha2Vsb24vRHJvcGJveCAoUGVyc29uYWwpL0NvZGUvRnJhbWVyLVZpZGVvUGxheWVyL2V4YW1wbGVzL2ZhY2Vib29rLWlvcy1wbGF5ZXIuZnJhbWVyL21vZHVsZXMvYmFycy5jb2ZmZWUiLCIvVXNlcnMvamF5c3Rha2Vsb24vRHJvcGJveCAoUGVyc29uYWwpL0NvZGUvRnJhbWVyLVZpZGVvUGxheWVyL2V4YW1wbGVzL2ZhY2Vib29rLWlvcy1wbGF5ZXIuZnJhbWVyL21vZHVsZXMvdmlkZW9wbGF5ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDOzs7RUFFQyxjQUFDLE9BQUQ7QUFFWCxRQUFBOztNQUZZLFVBQVE7O0lBRXBCLElBQUEsR0FBVSxPQUFPLENBQUMsSUFBWCxHQUFxQixPQUFPLENBQUMsSUFBN0IsR0FBdUM7SUFDOUMsVUFBQSxHQUFnQixPQUFPLENBQUMsU0FBWCxHQUEwQixPQUFPLENBQUMsU0FBbEMsR0FBaUQ7SUFDOUQsU0FBQSxHQUFlLE9BQU8sQ0FBQyxRQUFYLEdBQXlCLE9BQU8sQ0FBQyxRQUFqQyxHQUErQztJQUMzRCxXQUFBLEdBQWlCLE9BQU8sQ0FBQyxVQUFYLEdBQTJCLE9BQU8sQ0FBQyxVQUFuQyxHQUFtRDtJQUNqRSxTQUFBLEdBQWUsT0FBTyxDQUFDLFFBQVgsR0FBeUIsT0FBTyxDQUFDLFFBQWpDLEdBQStDO0lBRTNELHNDQUNFO01BQUEsTUFBQSxFQUFRLFVBQVI7TUFDQSxLQUFBLEVBQU8sQ0FBQyxTQUFBLEdBQVUsV0FBWCxDQUFBLEdBQXdCLElBRC9CO01BRUEsZUFBQSxFQUFpQixJQUZqQjtLQURGO0FBS0EsU0FBUywrRUFBVDtNQUNFLEdBQUEsR0FBVSxJQUFBLEtBQUEsQ0FDUjtRQUFBLFVBQUEsRUFBWSxJ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LEdBQW9CLFNBQUMsS0FBRDtJQUNsQixJQUFDLENBQUEsU0FBRCxHQUFhO0lBQ2IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLEdBQW9CO1dBQ3BCLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixHQUF1QixTQUFBO2FBQUcsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUFaO0VBSEw7O3dCQU1wQixtQkFBQSxHQUFxQixTQUFDLEtBQUQ7SUFDbkIsSUFBQyxDQUFBLFVBQUQsR0FBYztXQUNkLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixHQUF3QixTQUFBO2FBQUcsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUFaO0VBRkw7Ozs7R0F2UlciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgZXhwb3J0cy5CYXJzIGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cbiAgICBiYXJzID0gaWYgb3B0aW9ucy5iYXJzIHRoZW4gb3B0aW9ucy5iYXJzIGVsc2UgM1xuICAgIGJhcnNIZWlnaHQgPSBpZiBvcHRpb25zLmJhckhlaWdodCB0aGVuIG9wdGlvbnMuYmFySGVpZ2h0IGVsc2UgMjVcbiAgICBiYXJzV2lkdGggPSBpZiBvcHRpb25zLmJhcldpZHRoIHRoZW4gb3B0aW9ucy5iYXJXaWR0aCBlbHNlIDZcbiAgICBiYXJzUGFkZGluZyA9IGlmIG9wdGlvbnMuYmFyUGFkZGluZyB0aGVuIG9wdGlvbnMuYmFyUGFkZGluZyBlbHNlIDNcbiAgICBiYXJzQ29sb3IgPSBpZiBvcHRpb25zLmJhckNvbG9yIHRoZW4gb3B0aW9ucy5iYXJDb2xvciBlbHNlIFwiI2ZmZlwiXG5cbiAgICBzdXBlclxuICAgICAgaGVpZ2h0OiBiYXJzSGVpZ2h0XG4gICAgICB3aWR0aDogKGJhcnNXaWR0aCtiYXJzUGFkZGluZykqYmFyc1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBudWxsXG5cbiAgICBmb3IgaSBpbiBbMS4uYmFyc11cbiAgICAgIGJhciA9IG5ldyBMYXllclxuICAgICAgICBzdXBlckxheWVyOiBAXG4gICAgICAgIHdpZHRoOiBiYXJzV2lkdGhcbiAgICAgICAgaGVpZ2h0OiBiYXJzSGVpZ2h0XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogYmFyc0NvbG9yXG4gICAgICAgIHg6IChiYXJzV2lkdGgrYmFyc1BhZGRpbmcpICogKGktMSlcbiAgICAgICAgb3JpZ2luWTogMVxuICAgICAgQGFuaW1hdGVEb3duIGJhclxuXG4gIGFuaW1hdGVVcDogKHRhcmdldCkgLT5cbiAgICByYW5kID0gVXRpbHMucmFuZG9tTnVtYmVyIDEsIDEwXG4gICAgdGltZSA9IFV0aWxzLnJvdW5kIHJhbmQvMjAsIDJcbiAgICBzY2FsZSA9IFV0aWxzLnJvdW5kICgxIC0gcmFuZC8xMCksIDJcbiAgICBhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG4gICAgICBsYXllcjogdGFyZ2V0XG4gICAgICBwcm9wZXJ0aWVzOiBcbiAgICAgICAgc2NhbGVZOiBzY2FsZVxuICAgICAgdGltZTogdGltZVxuICAgIGFuaW1hdGlvbi5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuICAgICAgQGFuaW1hdGVEb3duIHRhcmdldFxuICAgIGFuaW1hdGlvbi5zdGFydCgpXG4gICAgXG4gIGFuaW1hdGVEb3duOiAodGFyZ2V0KSAtPlxuICAgIHJhbmQgPSBVdGlscy5yYW5kb21OdW1iZXIgMSwgMTBcbiAgICB0aW1lID0gVXRpbHMucm91bmQgcmFuZC8yMCwgMlxuICAgIHNjYWxlID0gVXRpbHMucm91bmQgcmFuZC8xMCwgMlxuICAgIGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cbiAgICAgIGxheWVyOiB0YXJnZXRcbiAgICAgIHByb3BlcnRpZXM6IFxuICAgICAgICBzY2FsZVk6IHRpbWVcbiAgICAgIHRpbWU6IHRpbWVcbiAgICBhbmltYXRpb24ub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cbiAgICAgIEBhbmltYXRlVXAgdGFyZ2V0XG4gICAgYW5pbWF0aW9uLnN0YXJ0KClcblxuIiwiY2xhc3MgZXhwb3J0cy5WaWRlb1BsYXllciBleHRlbmRzIExheWVyXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXG4gICAgIyBpbnN0YW5jZSB2YXJzIGZvciBsYXllcnMgd2Ugd2lsbCBjcmVhdGVcbiAgICBAdmlkZW9MYXllciA9IG51bGxcbiAgICBAcGxheUJ1dHRvbiA9IG51bGxcblxuICAgICMgaW5zdGFuY2UgdmFycyBmb3IgbGF5ZXJzIHdlIG1heSBjcmVhdGVcbiAgICBAcHJvZ2Vzc0JhciA9IG51bGxcbiAgICBAdGltZUVsYXBzZWQgPSBudWxsXG4gICAgQHRpbWVMZWZ0ID0gbnVsbFxuICAgIEB0aW1lVG90YWwgPSBudWxsXG5cbiAgICAjIGludGVybmFsIGluc3RhbmNlIHZhcnMgd2UgbWF5IGNyZWF0ZVxuICAgIEBfY3VycmVudGx5UGxheWluZyA9IG51bGxcbiAgICBAX3NoeVBsYXlCdXR0b24gPSBudWxsXG4gICAgQF9zaHlDb250cm9scyA9IG51bGxcbiAgICBAX2lzU2NydWJiaW5nID0gbnVsbFxuICAgIEBfc2hvd1Byb2dyZXNzID0gbnVsbFxuICAgIEBfc2hvd1RpbWVFbGFwc2VkID0gbnVsbFxuICAgIEBfc2hvd1RpbWVMZWZ0ID0gbnVsbFxuICAgIEBfc2hvd1RpbWVUb3RhbCA9IG51bGxcbiAgICBAX2NvbnRyb2xzQXJyYXkgPSBbXVxuXG4gICAgIyBwbGF5L3BhdXNlIGNvbnRyb2xcbiAgICBAcGxheWltYWdlID0gXCJpbWFnZXMvcGxheS5wbmdcIlxuICAgIEBwYXVzZWltYWdlID0gXCJpbWFnZXMvcGF1c2UucG5nXCJcblxuICAgIG9wdGlvbnMucGxheUJ1dHRvbkRpbWVuc2lvbnMgPz0gODBcbiAgICBvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcIiMwMDBcIlxuICAgIG9wdGlvbnMud2lkdGggPz0gNDgwXG4gICAgb3B0aW9ucy5oZWlnaHQgPz0gMjcwXG4gICAgaWYgb3B0aW9ucy5mdWxsc2NyZWVuXG4gICAgICBvcHRpb25zLndpZHRoID0gU2NyZWVuLndpZHRoXG4gICAgICBvcHRpb25zLmhlaWdodCA9IFNjcmVlbi5oZWlnaHRcblxuICAgICMgaGVyZSdzIG91ciBjb250YWluZXIgbGF5ZXJcbiAgICBzdXBlclxuICAgICAgd2lkdGg6IG9wdGlvbnMud2lkdGhcbiAgICAgIGhlaWdodDogb3B0aW9ucy5oZWlnaHRcbiAgICAgIGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG4gICAgIyBjcmVhdGUgdGhlIHZpZGVvbGF5ZXJcbiAgICBAdmlkZW9MYXllciA9IG5ldyBWaWRlb0xheWVyXG4gICAgICB3aWR0aDogb3B0aW9ucy53aWR0aFxuICAgICAgaGVpZ2h0OiBvcHRpb25zLmhlaWdodFxuICAgICAgc3VwZXJMYXllcjogQFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLmJhY2tncm91bmRDb2xvclxuICAgICAgbmFtZTogXCJ2aWRlb0xheWVyXCJcbiAgICBpZiBvcHRpb25zLmF1dG9wbGF5IHRoZW4gQHZpZGVvTGF5ZXIucGxheWVyLmF1dG9wbGF5ID0gdHJ1ZVxuICAgIGlmIG9wdGlvbnMubXV0ZWQgdGhlbiBAdmlkZW9MYXllci5wbGF5ZXIubXV0ZWQgPSB0cnVlXG5cbiAgICAjIGNyZWF0ZSBwbGF5L3BhdXNlIGJ1dHRvblxuICAgIEBwbGF5QnV0dG9uID0gbmV3IExheWVyXG4gICAgICB3aWR0aDogb3B0aW9ucy5wbGF5QnV0dG9uRGltZW5zaW9uc1xuICAgICAgaGVpZ2h0OiBvcHRpb25zLnBsYXlCdXR0b25EaW1lbnNpb25zXG4gICAgICBzdXBlckxheWVyOiBAdmlkZW9MYXllclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBudWxsXG4gICAgICBuYW1lOiBcInBsYXlCdXR0b25cIlxuXG4gICAgIyBzZXQgdXAgdGhlIGRlZmF1bHQgcGxheWJ1dHRvblxuICAgIEBwbGF5QnV0dG9uLnNob3dQbGF5ID0gPT4gQHBsYXlCdXR0b24uaW1hZ2UgPSBAcGxheWltYWdlXG4gICAgQHBsYXlCdXR0b24uc2hvd1BhdXNlID0gPT4gQHBsYXlCdXR0b24uaW1hZ2UgPSBAcGF1c2VpbWFnZVxuICAgIEBwbGF5QnV0dG9uLnNob3dQbGF5KClcbiAgICBAcGxheUJ1dHRvbi5jZW50ZXIoKVxuXG4gICAgIyBsaXN0ZW4gZm9yIGV2ZW50cyBvbiB0aGUgd2hvbGUgdmlkZW9sYXllclxuICAgICMgb3IgYWx0ZXJuYXRlbHksIGp1c3Qgb24gdGhlIHBsYXkvcGF1c2UgYnV0dG9uXG4gICAgYmluZFRvID0gaWYgb3B0aW9ucy5jb25zdHJhaW5Ub0J1dHRvbiB0aGVuIEBwbGF5QnV0dG9uIGVsc2UgQHZpZGVvTGF5ZXJcbiAgICBiaW5kVG8ub24gRXZlbnRzLkNsaWNrLCA9PlxuICAgICAgaWYgQHZpZGVvTGF5ZXIucGxheWVyLnBhdXNlZFxuICAgICAgICBAZW1pdCBcImNvbnRyb2xzOnBsYXlcIlxuICAgICAgICBAX2N1cnJlbnRseVBsYXlpbmcgPSB0cnVlXG4gICAgICAgIEB2aWRlb0xheWVyLnBsYXllci5wbGF5KClcbiAgICAgICAgQGZhZGVQbGF5QnV0dG9uKCkgaWYgQF9zaHlQbGF5QnV0dG9uXG4gICAgICAgIEBmYWRlQ29udHJvbHMoKSBpZiBAX3NoeUNvbnRyb2xzXG4gICAgICBlbHNlXG4gICAgICAgIEBlbWl0IFwiY29udHJvbHM6cGF1c2VcIlxuICAgICAgICBAX2N1cnJlbnRseVBsYXlpbmcgPSBmYWxzZVxuICAgICAgICBAdmlkZW9MYXllci5wbGF5ZXIucGF1c2UoKVxuICAgICAgICBAcGxheUJ1dHRvbi5hbmltYXRlU3RvcCgpXG4gICAgICAgIEBwbGF5QnV0dG9uLm9wYWNpdHkgPSAxXG4gICAgICAgIGZvciBsYXllciBpbiBAX2NvbnRyb2xzQXJyYXlcbiAgICAgICAgICBsYXllci5hbmltYXRlU3RvcCgpXG4gICAgICAgICAgbGF5ZXIub3BhY2l0eSA9IDFcbiAgICAgICAgXG4gICAgIyBldmVudCBsaXN0ZW5pbmcgb24gdGhlIHZpZGVvTGF5ZXJcbiAgICBFdmVudHMud3JhcChAdmlkZW9MYXllci5wbGF5ZXIpLm9uIFwicGF1c2VcIiwgPT5cbiAgICAgIEBlbWl0IFwidmlkZW86cGF1c2VcIlxuICAgICAgQHBsYXlCdXR0b24uc2hvd1BsYXkoKSB1bmxlc3MgQF9pc1NjcnViYmluZ1xuICAgIEV2ZW50cy53cmFwKEB2aWRlb0xheWVyLnBsYXllcikub24gXCJwbGF5XCIsID0+XG4gICAgICBAZW1pdCBcInZpZGVvOnBsYXlcIlxuICAgICAgQHBsYXlCdXR0b24uc2hvd1BhdXNlKClcbiAgICBFdmVudHMud3JhcChAdmlkZW9MYXllci5wbGF5ZXIpLm9uIFwiZW5kZWRcIiwgPT5cbiAgICAgIEBlbWl0IFwidmlkZW86ZW5kZWRcIlxuICAgICAgQF9jdXJyZW50bHlQbGF5aW5nID0gZmFsc2VcbiAgICAgIEB2aWRlb0xheWVyLnBsYXllci5wYXVzZSgpXG4gICAgICBAcGxheUJ1dHRvbi5hbmltYXRlU3RvcCgpXG4gICAgICBpZiBAX3NoeUNvbnRyb2xzXG4gICAgICAgIEBwbGF5QnV0dG9uLm9wYWNpdHkgPSAxXG4gICAgICAgIGZvciBsYXllciBpbiBAX2NvbnRyb2xzQXJyYXlcbiAgICAgICAgICBsYXllci5hbmltYXRlU3RvcCgpXG4gICAgICAgICAgbGF5ZXIub3BhY2l0eSA9IDFcbiAgICBAdmlkZW9MYXllci52aWRlbyA9IG9wdGlvbnMudmlkZW9cblxuICAgICMgZGVmYXVsdCB0aW1lIHRleHQgc3R5bGVzXG4gICAgQHRpbWVTdHlsZSA9IHsgXCJmb250LXNpemVcIjogXCIyMHB4XCIsIFwiY29sb3JcIjogXCIjMDAwXCIgfVxuXG4gICAgIyB0aW1lIHV0aWxpdGllc1xuICAgIEB2aWRlb0xheWVyLmZvcm1hdFRpbWUgPSAtPlxuICAgICAgc2VjID0gTWF0aC5mbG9vcihAcGxheWVyLmN1cnJlbnRUaW1lKVxuICAgICAgbWluID0gTWF0aC5mbG9vcihzZWMgLyA2MClcbiAgICAgIHNlYyA9IE1hdGguZmxvb3Ioc2VjICUgNjApXG4gICAgICBzZWMgPSBpZiBzZWMgPj0gMTAgdGhlbiBzZWMgZWxzZSBcIjBcIiArIHNlY1xuICAgICAgcmV0dXJuIFwiI3ttaW59OiN7c2VjfVwiXG4gICAgQHZpZGVvTGF5ZXIuZm9ybWF0VGltZUxlZnQgPSAtPlxuICAgICAgc2VjID0gTWF0aC5mbG9vcihAcGxheWVyLmR1cmF0aW9uKSAtIE1hdGguZmxvb3IoQHBsYXllci5jdXJyZW50VGltZSlcbiAgICAgIG1pbiA9IE1hdGguZmxvb3Ioc2VjIC8gNjApXG4gICAgICBzZWMgPSBNYXRoLmZsb29yKHNlYyAlIDYwKVxuICAgICAgc2VjID0gaWYgc2VjID49IDEwIHRoZW4gc2VjIGVsc2UgXCIwXCIgKyBzZWNcbiAgICAgIHJldHVybiBcIiN7bWlufToje3NlY31cIlxuXG5cbiAgIyBHZXR0ZXJzIG4nIHNldHRlcnNcbiAgQGRlZmluZSBcInZpZGVvXCIsXG4gICAgZ2V0OiAtPiBAdmlkZW9MYXllci5wbGF5ZXIuc3JjXG4gICAgc2V0OiAodmlkZW8pIC0+XG4gICAgICBAdmlkZW9MYXllci5wbGF5ZXIuc3JjID0gdmlkZW9cblxuICBAZGVmaW5lIFwic2hvd1Byb2dyZXNzXCIsXG4gICAgZ2V0OiAtPiBAX3Nob3dQcm9ncmVzc1xuICAgIHNldDogKHNob3dQcm9ncmVzcykgLT4gQHNldFByb2dyZXNzKHNob3dQcm9ncmVzcylcblxuICBAZGVmaW5lIFwic2hvd1RpbWVFbGFwc2VkXCIsXG4gICAgZ2V0OiAtPiBAX3Nob3dUaW1lRWxhcHNlZFxuICAgIHNldDogKHNob3dUaW1lRWxhcHNlZCkgLT4gQHNldFRpbWVFbGFwc2VkKHNob3dUaW1lRWxhcHNlZClcblxuICBAZGVmaW5lIFwic2hvd1RpbWVMZWZ0XCIsXG4gICAgZ2V0OiAtPiBAX3Nob3dUaW1lTGVmdFxuICAgIHNldDogKHNob3dUaW1lTGVmdCkgLT4gQHNldFRpbWVMZWZ0KHNob3dUaW1lTGVmdClcblxuICBAZGVmaW5lIFwic2hvd1RpbWVUb3RhbFwiLFxuICAgIGdldDogLT4gQF9zaG93VGltZVRvdGFsXG4gICAgc2V0OiAoc2hvd1RpbWVUb3RhbCkgLT4gQHNldFRpbWVUb3RhbChzaG93VGltZVRvdGFsKVxuXG4gIEBkZWZpbmUgXCJzaHlQbGF5QnV0dG9uXCIsIFxuICAgIGdldDogLT4gQF9zaHlQbGF5QnV0dG9uXG4gICAgc2V0OiAoc2h5UGxheUJ1dHRvbikgLT4gQHNldFNoeVBsYXlCdXR0b24oc2h5UGxheUJ1dHRvbilcblxuICBAZGVmaW5lIFwic2h5Q29udHJvbHNcIiwgXG4gICAgZ2V0OiAtPiBAX3NoeUNvbnRyb2xzXG4gICAgc2V0OiAoc2h5Q29udHJvbHMpIC0+IEBzZXRTaHlDb250cm9scyhzaHlDb250cm9scylcblxuICBAZGVmaW5lIFwicGxheUJ1dHRvbkltYWdlXCIsXG4gICAgZ2V0OiAtPiBAcGxheWltYWdlXG4gICAgc2V0OiAocGxheUJ1dHRvbkltYWdlKSAtPiBAc2V0UGxheUJ1dHRvbkltYWdlKHBsYXlCdXR0b25JbWFnZSlcblxuICBAZGVmaW5lIFwicGF1c2VCdXR0b25JbWFnZVwiLFxuICAgIGdldDogLT4gQHBhdXNlaW1hZ2VcbiAgICBzZXQ6IChwYXVzZUJ1dHRvbkltYWdlKSAtPiBAc2V0UGF1c2VCdXR0b25JbWFnZShwYXVzZUJ1dHRvbkltYWdlKVxuXG4gIEBkZWZpbmUgXCJwbGF5ZXJcIixcbiAgICBnZXQ6IC0+IEB2aWRlb0xheWVyLnBsYXllclxuXG5cbiAgIyBzaG93IHRoZSBwcm9ncmVzcyBiYXJcbiAgc2V0UHJvZ3Jlc3M6IChzaG93UHJvZ3Jlc3MpIC0+XG4gICAgQF9zaG93UHJvZ3Jlc3MgPSBzaG93UHJvZ3Jlc3NcblxuICAgICMgY3JlYXRlIGFuZCBzZXQgdXAgdGhlIHByb2dyZXNzIGJhciB3aXRoIGRlZmF1bHQgc3R5bGVzXG4gICAgQHByb2dyZXNzQmFyID0gbmV3IFNsaWRlckNvbXBvbmVudFxuICAgICAgd2lkdGg6IDQ0MFxuICAgICAgaGVpZ2h0OiAxMFxuICAgICAga25vYlNpemU6IDQwXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2NjY1wiXG4gICAgICBtaW46IDBcbiAgICAgIHZhbHVlOiAwXG4gICAgICBuYW1lOiBcInByb2dyZXNzQmFyXCJcbiAgICBAX2NvbnRyb2xzQXJyYXkucHVzaCBAcHJvZ3Jlc3NCYXJcbiAgICBAcHJvZ3Jlc3NCYXIua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXG4gICAgIyBzZXQgYW5kIGF1dG9tYXRlIHByb2dyZXNzIGJhclxuICAgIEV2ZW50cy53cmFwKEB2aWRlb0xheWVyLnBsYXllcikub24gXCJjYW5wbGF5XCIsID0+XG4gICAgICBAcHJvZ3Jlc3NCYXIubWF4ID0gTWF0aC5yb3VuZChAdmlkZW9MYXllci5wbGF5ZXIuZHVyYXRpb24pXG4gICAgRXZlbnRzLndyYXAoQHZpZGVvTGF5ZXIucGxheWVyKS5vbiBcInRpbWV1cGRhdGVcIiwgPT5cbiAgICAgIEBwcm9ncmVzc0Jhci5rbm9iLm1pZFggPSBAcHJvZ3Jlc3NCYXIucG9pbnRGb3JWYWx1ZShAdmlkZW9MYXllci5wbGF5ZXIuY3VycmVudFRpbWUpXG5cbiAgICAjIHNlZWtpbmcvc2NydWJiaW5nIGV2ZW50c1xuICAgICMgYW5kIGJ0dyBub25lIG9mIHRoaXMgd29ya3Mgc3VwZXIgZ3JlYXQgdXNpbmcgdmVyeSBsYXJnZSB2aWRlb3NcbiAgICBAcHJvZ3Jlc3NCYXIub24gXCJjaGFuZ2U6dmFsdWVcIiwgPT5cbiAgICAgIGlmIEBfY3VycmVudGx5UGxheWluZyB0aGVuIEB2aWRlb0xheWVyLnBsYXllci5jdXJyZW50VGltZSA9IEBwcm9ncmVzc0Jhci52YWx1ZVxuICAgIEBwcm9ncmVzc0Jhci5rbm9iLm9uIEV2ZW50cy5EcmFnU3RhcnQsID0+XG4gICAgICBAX2lzU2NydWJiaW5nID0gdHJ1ZVxuICAgICAgaWYgQF9jdXJyZW50bHlQbGF5aW5nIHRoZW4gQHZpZGVvTGF5ZXIucGxheWVyLnBhdXNlKClcbiAgICBAcHJvZ3Jlc3NCYXIua25vYi5vbiBFdmVudHMuRHJhZ0VuZCwgPT5cbiAgICAgIEBfaXNTY3J1YmJpbmcgPSBmYWxzZVxuICAgICAgQHZpZGVvTGF5ZXIucGxheWVyLmN1cnJlbnRUaW1lID0gQHByb2dyZXNzQmFyLnZhbHVlXG4gICAgICBpZiBAX2N1cnJlbnRseVBsYXlpbmcgdGhlbiBAdmlkZW9MYXllci5wbGF5ZXIucGxheSgpXG5cbiAgIyBzZXQgZmxhZyBmb3Igc2h5IHBsYXkgYnV0dG9uXG4gIHNldFNoeVBsYXlCdXR0b246IChzaHlQbGF5QnV0dG9uKSAtPlxuICAgIEBfc2h5UGxheUJ1dHRvbiA9IHNoeVBsYXlCdXR0b25cbiAgIyBmYWRlIG91dCB0aGUgcGxheSBidXR0b25cbiAgZmFkZVBsYXlCdXR0b246ICgpIC0+XG4gICAgQHBsYXlCdXR0b24uYW5pbWF0ZVxuICAgICAgcHJvcGVydGllczpcbiAgICAgICAgb3BhY2l0eTogMFxuICAgICAgdGltZTogMlxuXG4gICMgc2V0IGZsYWcgZm9yIHNoeSBjb250cm9sc1xuICBzZXRTaHlDb250cm9sczogKHNoeUNvbnRyb2xzKSAtPlxuICAgIEBfc2h5Q29udHJvbHMgPSBzaHlDb250cm9sc1xuICAjIHNob3J0Y3V0IHRvIGZhZGUgb3V0IGFsbCB0aGUgY29udHJvbHNcbiAgZmFkZUNvbnRyb2xzOiAoKSAtPlxuICAgIGZvciBsYXllciwgaW5kZXggaW4gQF9jb250cm9sc0FycmF5XG4gICAgICBsYXllci5hbmltYXRlXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICB0aW1lOiAyXG4gICAgXG4gICMgc2hvdyBhbmQgaW5jcmVtZW50IGVsYXBzZWQgdGltZVxuICBzZXRUaW1lRWxhcHNlZDogKHNob3dUaW1lRWxhcHNlZCkgLT5cbiAgICBAX3Nob3dUaW1lRWxhcHNlZCA9IHNob3dUaW1lRWxhcHNlZFxuXG4gICAgaWYgc2hvd1RpbWVFbGFwc2VkIGlzIHRydWVcbiAgICAgIEB0aW1lRWxhcHNlZCA9IG5ldyBMYXllclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICBuYW1lOiBcImN1cnJlbnRUaW1lXCJcbiAgICAgIEBfY29udHJvbHNBcnJheS5wdXNoIEB0aW1lRWxhcHNlZFxuXG4gICAgICBAdGltZUVsYXBzZWQuc3R5bGUgPSBAdGltZVN0eWxlXG4gICAgICBAdGltZUVsYXBzZWQuaHRtbCA9IFwiMDowMFwiXG5cbiAgICAgIEV2ZW50cy53cmFwKEB2aWRlb0xheWVyLnBsYXllcikub24gXCJ0aW1ldXBkYXRlXCIsID0+XG4gICAgICAgIEB0aW1lRWxhcHNlZC5odG1sID0gQHZpZGVvTGF5ZXIuZm9ybWF0VGltZSgpXG5cbiAgIyBzaG93IGFuZCBkZWNyZW1lbnQgdGltZSByZW1haW5pbmdcbiAgc2V0VGltZUxlZnQ6IChzaG93VGltZUxlZnQpID0+XG4gICAgQF9zaG93VGltZUxlZnQgPSBzaG93VGltZUxlZnRcblxuICAgIGlmIHNob3dUaW1lTGVmdCBpcyB0cnVlXG4gICAgICBAdGltZUxlZnQgPSBuZXcgTGF5ZXJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcbiAgICAgICAgbmFtZTogXCJ0aW1lTGVmdFwiXG4gICAgICBAX2NvbnRyb2xzQXJyYXkucHVzaCBAdGltZUxlZnRcblxuICAgICAgQHRpbWVMZWZ0LnN0eWxlID0gQHRpbWVTdHlsZVxuXG4gICAgICBAdGltZUxlZnQuaHRtbCA9IFwiLTA6MDBcIlxuICAgICAgRXZlbnRzLndyYXAoQHZpZGVvTGF5ZXIucGxheWVyKS5vbiBcImxvYWRlZG1ldGFkYXRhXCIsID0+XG4gICAgICAgIEB0aW1lTGVmdC5odG1sID0gXCItXCIgKyBAdmlkZW9MYXllci5mb3JtYXRUaW1lTGVmdCgpXG5cbiAgICAgIEV2ZW50cy53cmFwKEB2aWRlb0xheWVyLnBsYXllcikub24gXCJ0aW1ldXBkYXRlXCIsID0+XG4gICAgICAgIEB0aW1lTGVmdC5odG1sID0gXCItXCIgKyBAdmlkZW9MYXllci5mb3JtYXRUaW1lTGVmdCgpXG5cbiAgIyBzaG93IGEgc3RhdGljIHRpbWVzdGFtcCBmb3IgdG90YWwgZHVyYXRpb25cbiAgc2V0VGltZVRvdGFsOiAoc2hvd1RpbWVUb3RhbCkgPT5cbiAgICBAX3Nob3dUaW1lVG90YWwgPSBzaG93VGltZVRvdGFsXG5cbiAgICBpZiBzaG93VGltZVRvdGFsIGlzIHRydWVcbiAgICAgIEB0aW1lVG90YWwgPSBuZXcgTGF5ZXJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcbiAgICAgICAgbmFtZTogXCJ0aW1lVG90YWxcIlxuICAgICAgQF9jb250cm9sc0FycmF5LnB1c2ggQHRpbWVUb3RhbFxuXG4gICAgICBAdGltZVRvdGFsLnN0eWxlID0gQHRpbWVTdHlsZVxuXG4gICAgICBAdGltZVRvdGFsLmh0bWwgPSBcIjA6MDBcIlxuICAgICAgRXZlbnRzLndyYXAoQHZpZGVvTGF5ZXIucGxheWVyKS5vbiBcImxvYWRlZG1ldGFkYXRhXCIsID0+XG4gICAgICAgIEB0aW1lVG90YWwuaHRtbCA9IEB2aWRlb0xheWVyLmZvcm1hdFRpbWVMZWZ0KClcblxuICAjIHNldCBhIG5ldyBpbWFnZSBmb3IgdGhlIHBsYXkgYnV0dG9uXG4gIHNldFBsYXlCdXR0b25JbWFnZTogKGltYWdlKSA9PlxuICAgIEBwbGF5aW1hZ2UgPSBpbWFnZVxuICAgIEBwbGF5QnV0dG9uLmltYWdlID0gaW1hZ2VcbiAgICBAcGxheUJ1dHRvbi5zaG93UGxheSA9IC0+IEBpbWFnZSA9IGltYWdlXG5cbiAgIyBzZXQgYSBuZXcgaW1hZ2UgZm9yIHRoZSBwYXVzZSBidXR0b25cbiAgc2V0UGF1c2VCdXR0b25JbWFnZTogKGltYWdlKSA9PlxuICAgIEBwYXVzZWltYWdlID0gaW1hZ2VcbiAgICBAcGxheUJ1dHRvbi5zaG93UGF1c2UgPSAtPiBAaW1hZ2UgPSBpbWFnZSJdfQ==
