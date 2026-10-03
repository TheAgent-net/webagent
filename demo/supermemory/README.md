# supermemory demo

`webagent demo supermemory` pixel-clones https://supermemory.com (follows the live redirect to supermemory.ai), rewrites assets onto this host, and injects the webagent widget. A hand-written stub is refused.

```text
demo/supermemory/site    pixel clone of the origin + {{WIDGET_JS}}
demo/supermemory/pack    → packs/supermemory
demo/supermemory/deploy  nginx + systemd + env
```

```text
webagent serve --pack packs/supermemory :8791
webagent demo supermemory
webagent demo supermemory --refresh    # re-clone
```

Chrome is required the first time (or whenever the site is not a pixel clone). Set `CHROME` if it is not on the default path.
