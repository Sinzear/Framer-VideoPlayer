# Framer Video Player Module

A [Framer](http://framerjs.com) module that makes it simple to drop in a video player to any prototype and customize the player's controls.

Major thanks to [Benjamin Den Boer](https://github.com/benjaminnathan). This module is based on his [AudioPlayer module](https://github.com/benjaminnathan/Framer-AudioPlayer) and started as a fork of that module; it uses a lot of the same conventions and contains a lot of his original code. And it seeks to solve a very similar problem: to make it easier to prototype using media.

## Installation

1. Grab `videoplayer.coffee` from this repo's `/modules` directory
2. Put it into your Framer Studio project's  `/modules` directory. 
3. Then, in your Framer prototype, require the module with this line:

```coffeescript
{VideoPlayer} = require "videoplayer"
```

---

## Examples

#### [Basic video player prototype](http://share.framerjs.com/lrh9kyuq39lr/)

Demonstrates the default video player with standard controls.

#### [YouTube iOS app player prototype](http://share.framerjs.com/3fh1jvmlr4oq/)

Demonstrates a video player with some customization and "shy controls."

#### [Facebook iOS app player prototype](http://share.framerjs.com/37vpv2pvnvfs/)

Demonstrates a fairly customized video player with some bells and whistles.

![Examples](https://raw.githubusercontent.com/stakes/Framer-VideoPlayer/master/exampleImage.jpg)

---

## Usage

### Creating a basic player

Simply put, the VideoPlayer module is a superlayer that wraps up Framer's own [VideoLayer](http://framerjs.com/docs/#videolayer.videolayer) with some extra functionality and controls that you might want when prototyping with video.

The simplest way to create a VideoPlayer instance is:

```coffeescript
video = new VideoPlayer
  width: 480
  height: 270
  video: "path/to/video.mov"
```

And actually, it's just as easy to create a player that fits perfectly to Screen.width and Screen.height:

```coffeescript
video = new VideoPlayer
  video: "path/to/video.mov"
  fullscreen: true
```
---

### The play/pause button

When instantiated, the VideoPlayer module will create a button that toggles between playing and pausing the video. It will look for two images for the two states of this button, `images/play.png` and `images/pause.png`.

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

By default the VideoPlayer module will toggle between playing and paused states if you click or tap anywhere on the video. If you don't want that, and you _just_ want the play button itself to control the video, set the `constrainToButton` option to `true` when you create an instance of the VideoPlayer module:

```coffeescript
video = new Video
  video: "path/to/video.mov"
  constrainToButton: true
  # etc
```
---

### The progress bar

The VideoPlayer module makes it simple to add a progress bar that reflects the video's progress and allows you to scrub and seek through the video. 

Dragging the progress bar when the video is playing should scrub the video, and dragging when it's paused should seek. That said, right now the scrubbing works great in Framer Studio but less so in the browser or on the device.

```coffeescript
video.showProgress = true
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

---

### Timestamps

There are three different timestamps you can choose to show. Time elapsed and time left will update dynamically based on the video progress. Total time is a static value, the length of the entire video.

Usually you'll want to display either time left or total time, along with the time elapsed. But I mean if you want all three, you do you, I won't judge.

#### Time elapsed

Create, show and position a timestamp that updates with the time elapsed as the video plays:

```coffeescript
video.showTimeElapsed = true
timeElapsed = video.timeElapsed
timeElapsed.x = 100
timeElapsed.centerY(100)
```

#### Time left

Create, show and position a timestamp that updates with the time left in the video:

```coffeescript
video.showTimeLeft = true 
timeLeft = video.timeLeft
timeLeft.maxX = 650
timeLeft.centerY(100)
```

#### Total time

Create, show and position a static timestamp with the total duration of the video:

```coffeescript
video.showTimeTotal = true
timeTotal = video.timeTotal
timeTotal.maxX = 650
timeTotal.centerY(100)
```

#### Customizing timestamp appearance

The `video.timeStyle` property is a CSS string that will customize the appearance of all three timestamps.

```coffeescript
video.timeStyle = { "font-size": "20px", "color": "#fff" }
```

---

### Shyness

It's common for video controls to fade out after a second or two, and fade back in when the video is acted upon. The VideoPlayer module can show and hide the button and controls for you, fading over two seconds. You can enable this behavior on the play button with:

```coffeescript
video.shyPlayButton = true
```

You can also enable this behavior on the rest of the controls - the progress bar and any visible timestamps - with:

```coffeescript
video.shyControls = true
```

---

### The `<video>` element

The VideoPlayer component gives shorthand access to the [HTML5 <video> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) that plays the video through `video.player`.

So you can use any of the properties, methods and events of the HTML5 media element itself: see [this overview](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) for the full breakdown.

For example, want the video to loop? Easy:

```coffeescript
video.player.loop = true
```

---

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

---

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
  # ooh, moving pictures
video.on "video:pause", ->
  # aww, they froze
video.on "video:ended", ->
  # sad, it's over
```

These are just for convenience; they're the same as wrapping `video.player` and listening for the `"play"`, `"pause"` and `"ended"` events.
