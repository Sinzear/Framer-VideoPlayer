# Framer Video Player Module

A [Framer](http://framerjs.com) module that makes it simple to drop in a video player to any prototype and customize the player's controls.

Major thanks to [Benjamin Den Boer](https://github.com/benjaminnathan). This module is based on his [AudioPlayer module](https://github.com/benjaminnathan/Framer-AudioPlayer) and started as a fork of that module; it uses a lot of the same conventions and contains a lot of his original code. And it seeks to solve a very similar problem: to make it easier to prototype using media.

## Examples

#### Basic video player prototype

Demonstrates the default video player with standard controls.

#### YouTube iOS app player prototype

Demonstrates a video player with some customization and "shy controls."

#### Facebook iOS app player prototype

Demonstrates a super-customized video player with a lot of bells and whistles.

## Usage

### Including the module

1. Grab `videoplayer.coffee` from this repo's `/modules` directory
2. Put it into your Framer Studio project's  `/modules` directory. 
3. Then, in your Framer prototype, require the module with this line:

```coffeescript
{VideoPlayer} = require "videoplayer"
```

### Creating a basic player

Simply put, the VideoPlayer module creates an instance of Framer's own [VideoLayer](http://framerjs.com/docs/#videolayer.videolayer) and gives it superpowers.

To create a player with explicit dimensions, all you need to do is:

```coffeescript
video = new VideoPlayer
  width: 480
  height: 270
  video: "path/to/video.mov"
```

It's even easier to create a player that expands to Screen.width and Screen.height with:

```coffeescript
video = new VideoPlayer
  video: "path/to/video.mov"
  fullscreen: true
```
