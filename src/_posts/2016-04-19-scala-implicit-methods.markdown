---
published: true
title: Scala Implicit methods
description: Wanna pass an integer as a argument to a method that accepts String?! Use implicits methods for implicit type conversion 
layout: post
type: post
tags: [scala, implicits, implicit, method, view, bound]
categories: [scala, implicits]
---
How often do you want to have a method that accepts more than one incompatible, but interconvertible(as deemed by the programmer) types.

For example, let's say you have a MyMediaPlayer class. As the name suggests it's type represents a media player which can play songs from a playlist. We have MyPlaylist class to represent our playlist. MyPlaylist class is our proprietary class.


```scala

   case class MyPlaylist(name: String, songs: List[MySong], isShuffle: Boolean, isReplay: Boolean) 

   object MyMediaPlayer {

       def play(playlist: MyPlaylist) {
          //play songs from playlist
        }

   }
```

All was well till a new open standard was defined for playlists(let's call its class OpenPlaylist). All major media players have started supporting the open standard playlist except us. Since the new playlist is open, a user can create a playlist once and can play the same playlist in any media players that support the open standard playlist. Also, the open standard playlist have lot more features to it than our playlist.
As a result, people have started ignoring our media player. 

```scala

 case class OpenPlaylist(name: String, songs: List[Song], playlistProps: OpenPlaylistProperties) 

case class OpenPlaylistProperties(shuffle: Boolean, replay: Boolean, lotMoreOptions: Map[String, String])

```

We need to come up with a solution quickly to use OpenPlaylist instead of MyPlaylist in our application. 
So, we change our MyMediaPlayer.play(..) method to accept OpenPlaylist instead of MyPlaylist.

```scala

   object MyMediaPlayer {

       def play(playlist: OpenPlaylist) {
          //play songs from playlist
        }

   }
```

But the only problem is MyMediaPlayer.play(..) method is called from across our application in numerous places. Changing everywhere will require a lot of effort and time that we cannot afford since we are drastically losing our market share. So, for the time being we need to quickly fix it eventhough we may not be able to support some additional features that OpenPlaylist supports.


Here comes Scala's implicit methods.  Implicit methods are methods that do conversions from one type to another, and implicitly bind the conversions at compile time if it's in scope.

So, I am adding an implicit method in MyMediaPlayer that converts MyPlaylist to OpenPlaylist.

```scala

   object MyMediaPlayer {

       def play(playlist: OpenPlaylist) {
          //play songs from playlist
        }

      implicit def MyPlaylistToOpenPlaylist(myPlaylist: MyPlaylist): OpenPlaylist = {
        //convert MyPlaylist to OpenPlaylist and set default values for yet-to-be supported OpenPlaylist features and return it
      }

   }
```

That's it. Everywhere from where I am calling MyMediaPlayer.play(..) with MyPlaylist argument will be converted to OpenPlaylist before the play(..) method is called.

scala.collection.JavaConverters._ has a lot of implicit methods that convert between Java collections and it's equivalent scala collections. Thus you can pass java.util.Set to a method which accepts scala.collection.mutable.Set and vice versa.


A few things to note

1) The implicit method must be in scope when the play(..) is invoked. ie. we need to "import MyMediaPlayer._ " before calling the play method with MyPlaylist argument


Go through through implicit bounds and view bounds to define generic bounds with Implicit conversions.
