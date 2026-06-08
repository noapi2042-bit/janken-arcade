# Retro Janken Arcade

A smartphone-friendly retro arcade rock-paper-scissors game.

## Character Images

This prototype uses these 7 CPU character images:

- `character_normal.png`
- `character_happy.png`
- `character_smug.png`
- `character_worried.png`
- `character_panic.png`
- `character_excited.png`
- `character_lose.png`

Internal moods such as `win`, `draw`, and `shocked` are mapped to the existing 7 images.

## Scene Images

These scene illustrations are used for intro and ending cutscenes:

- `scene_intro.png`
- `scene_player_win.png`
- `scene_player_lose.png`

## Sounds

Expected sound files:

- `bgm_loop.mp3`
- `bgm_chance.mp3`
- `bgm_final.mp3`
- `cutin_stinger.mp3`

`cutin_stinger.mp3` is used only for psych, chance, and final cinematic cut-ins.

## Controls

After starting the game, a short input guide points to the rock-paper-scissors buttons.

In Final Janken mode, the first button press is a confirmation step. Press the same hand again to lock in the final choice.

## Gallery

Gallery mode is hidden on first launch.

It appears on the title screen only after the player clears the game with a final win in the current session. The gallery unlock is not persisted with `localStorage`, so reloading the page starts with Gallery hidden again.
