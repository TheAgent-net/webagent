# supermemory demo

The webagent is the widget and `POST /chat`. This folder is the website + deploy story.

```text
demo/supermemory/site    landing that embeds /widget.js
demo/supermemory/pack    → packs/supermemory
demo/supermemory/deploy  nginx + systemd + env
```

```text
webagent serve --pack packs/supermemory :8791
webagent demo supermemory
```
