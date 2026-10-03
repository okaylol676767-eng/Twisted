# Outfit imports

Drop a photo of a character wearing an outfit in here, list it in
`manifest.json`, and the game wears it instead of cutting a garment over the base photo.
The generated garment remains the fallback, so this file starts out doing nothing.

## `manifest.json`

Keys are `<character>-<outfit>`, all lower-case.

| Character | Outfit keys |
|---|---|
| Adeline | `sleepwear`, `work`, `evening` |
| Zade | `casual`, `evening-casual` |

A value can be a bare path:

    { "zade-casual": "assets/outfits/zade-casual.webp" }

or an object when the shot needs re-registering:

    { "adeline-evening": { "src": "assets/outfits/adeline-evening.png",
                          "crop": "6%", "scale": 1.04 } }

| Key | Meaning | Default |
|---|---|---|
| `src` | Path to the photo. **Required.** | — |
| `crop` | Vertical `object-position` | `4%` (`8%`/`10%` on small screens) |
| `offsetX` | Horizontal `object-position` | `50%` |
| `scale` | Zoom about the slot centre | `1` |

Adding one entry changes exactly one look and leaves the rest on the generated garment.

### Why a manifest and not a directory scan

Scanning for `<character>-<outfit>.<ext>` across `png`, `webp`, `jpg` and `jpeg`
means four 404s for every look that has no file — twenty errors in the console
on a first run, for a feature most players never touch. The manifest is one
request that resolves whether there is anything to do at all.

## Framing a replacement shot

A re-shot body will not sit in the frame exactly like the base portrait. Start
with `scale`: a photo whose head is clipped wants it below `1`, one that floats
too small wants it above. Reach for `crop` and `offsetX` only if the body is
vertically or horizontally off-centre in the file itself.

The overrides are applied to the portrait slot rather than the image, so the
portrait, its garment layer and any import all resolve to one geometry — set them
in the wrong place and the layers drift apart.

## What happens to the file

The photo is background-cut out at runtime exactly as the base portrait is: a
flood fill from the borders removes the studio backdrop. A PNG that already has
a transparent background passes through untouched. Cut-out results are cached
per file for the session, so returning to a look you have already seen costs
nothing to re-encode.

See the wardrobe section of the top-level README for the generated fallback.