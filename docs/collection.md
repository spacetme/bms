
The music in this game is arranged into "collections."
A collection is simply a collection of music.



`collection.yml`
----------------
This file lists all the music in the music collection.  The schema is as follows:

```yaml
name: Collection Name
description: |
  Collection description. Can contain Markdown.
music:
  - title: Song title
  - artist: Artist name
  - genre: Genre
  - path: Directory name, relative to this file
  - level:
      ID: BMS file
```

### Level ID

The level identifier. Use the following convention:

```
ButtonsDifficultyLevel
```


  * __Buttons__: The number of buttons.
      * Right now, we only support 7 buttons, so it must be `7`.
  * __Difficulty__: The difficulty of the song.
      * `ES` - Easy
      * `NM` - Normal
      * `HD` - Hard
      * `EX` - Expert
  * __Level__: The song's level.
      * The level of the song is an arbitary number.
        Higher number means harder.


For example, `7HD34` means 7 keys, hard diffculty, and level 34.










