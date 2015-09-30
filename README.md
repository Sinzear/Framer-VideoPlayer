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

### The play/pause button

By default the VideoPlayer module will toggle between playing and paused states if you click or tap anywhere on the video.

When instantiated, the VideoPlayer module will also create a button that toggles between playing and pausing the video. It will look for two images for the two states of this button, `images/play.png` and `images/pause.png`.

If these images don't exist, the button will effectively be invisible. You can also change these images:

```coffeescript
  video.playButtonImage = "path/to/anotherplaybutton.png"
  video.pauseButtonImage = "path/to/anotherpausebutton.png"
```

By default this button is 80x80 and centered on the video. You can customize the button's appearance and position, since it's just a Framer layer:

```coffeescript
  video.playButton.width = 40
  video.playButton.height = 40
  video.playButton.x = 50
  video.playButton.centerY(100)
```

You can also tell the play/pause button to hide and show itself, which is a standard behavior for buttons overlaid on video players. The button will fade out or in over two seconds.

```coffeescript
  video.shyPlayButton = true
```

### The progress bar

### Timestamps

### More
