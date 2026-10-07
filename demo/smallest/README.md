# Smallest demo

The webagent is the widget and `POST /chat`. This folder is the website + deploy story.

```text
demo/smallest/site    landing that embeds /widget.js
demo/smallest/pack    → packs/smallest
demo/smallest/deploy  nginx + systemd + env
```

```text
webagent serve --pack packs/smallest :8789
webagent demo smallest
```
