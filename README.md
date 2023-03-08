# NRO Batch forwader

This is a NodeJS Script that reads an .json with a list of games and generate forwaders for retroarch as .NRO to be installed
Change the games_list.json file

## Features

- [x] Dont compress the icon jpeg image (need be a 256x256 jpeg image and put at ./icons/ folder)
- [x] Create all forwarder without a single prompt (easy for regenerate)
- [x] Simple list of games at games_list.json file


# Requirements

- your ./keys.dat keyset file extracted from switch (check hbp/readme.md for more info)

# Structure of games_list.json objects

| name      | titleId (optional-generated) | icon (name of icon inside ./icons/ folder) | publisher         | nro_path (path to retroarch on switch) |
| --------- | ---------------------------- | ------------------------------------------ | ----------------- | -------------------------------------- |
| RetroArch | 01105d3e34002000             | retroarch.jpg                              | The Libretro Team | switch/retroarch_switch.nro            |
