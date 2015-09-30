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

The VideoPlayer module makes it simple to add a progress bar that reflects the video's progress and allows you to scrub and seek through the video. Dragging the progress bar when the video is playing should scrub the video, and dragging when it's paused should seek.

```coffeescript
  video.showProgressBar = true
```

After you've created a progress bar, you'll have access to `video.progressBar` which is an instance of Framer's [SliderComponent](http://framerjs.com/docs/#slider.slidercomponent). You can of course set the dimensions and position of the progress bar:

```coffeescript
  video.progressBar.width = 340
  video.progressBar.height = 10
  video.progressBar.midX = Screen.width/2
  video.progressBar.y = 220
```

And you can also customize the appearance of the progress bar just as you would a [SliderComponent](http://framerjs.com/docs/#slider.slidercomponent):

```coffeescript
  video.progressBar.knobSize = 22
  video.progressBar.borderRadius = 0
  video.progressBar.knob.shadowColor = null
  video.progressBar.backgroundColor = "#eee"
  video.progressBar.fill.backgroundColor = "#333"
```

### Timestamps


### The `<video>` element

The VideoPlayer component gives shorthand access to the [HTML5 <video> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) that plays the video through `video.player`.

So you can use any of the properties, methods and events of the HTML5 media element itself: see (this overview)[https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement] for the full breakdown.

### Autoplay and muting

If you want the video to automatically play, you can pass in `autoplay` as an option when you instantiate a new VideoPlayer. And if you want the video to play with sound off, similarly pass in `muted` as an option.

```coffeescript
  video = new VideoPlayer
    video: "path/to/video.mov"
    fullscreen: true
    autoplay: true
    muted: true
```

Note that on iOS devices, the muted attribute is ignored on videos since they respect the device's volume control.

If you want to modify either `autoplay` or `muted` after creating a new VideoPlayer, do it through `video.player`:

```coffeescript
  video.player.autoplay = true
  video.player.muted = false
```

### Events

The VideoPlayer module emits a couple of custom events that you can listen for - play/pause button presses, and the status of the video itself.

Say you added an "HD" button and want to hide it when the play button is tapped, and show it again when the pause button is tapped:

```coffeescript
  video.on "controls:play", ->
    # hide it
  video.on "controls:pause", ->
    # show it again
```

You could also listen for the actual play and pause status of the video itself, as well as for when the video ends:

```coffeescript
  video.on "video:play", ->
    # ooh moving pictures
  video.on "video:pause", ->
    # they are paused
  video.on "video:ended", ->
    # aww, it's over
```
