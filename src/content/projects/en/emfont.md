Open a Chinese-language website, and chances are you’ll be greeted by Microsoft JhengHei.

Not because everyone particularly loves it, but because Chinese fonts can contain tens of thousands of glyphs, with file sizes easily reaching 10 MB or more. That’s a lot to load on a webpage. So most websites simply settle for whatever fonts happen to be installed on the user’s device.

The same sentence feels completely different in a rounded sans-serif than in a traditional serif. Typography gives words their voice. It carries the emotions designers want to express, yet Chinese websites are often left speaking in the same one.

During my second year of high school, I noticed developers and designers struggling with the same problem: the fonts they wanted were too large, and there were few free, open-source options that could be used directly on the web.

So I started building emfont.

## One Line. That’s It.

Pick a font on emfont, copy its ID, add an `@import` to your CSS, and set your `font-family`. Your website now has a new voice.

No registration. No fees.

You can preview fonts with your own text directly on the website. Not sure which one to choose? You can even ask AI to find the right font through the emfont MCP server.

emfont offers over a hundred open-source typefaces, including sans-serifs, serifs, rounded fonts, pixel fonts, and handwritten styles. It also supports English, Japanese, Korean, and icon fonts.

For many students and designers, emfont has become more than a font delivery service. It’s also a place to discover great free fonts.

## Cutting Fonts Down to Size

The real challenge is file size.

emfont converts fonts to `.woff2` and offers two loading approaches: pre-generated static subsets that are ready to use, and precise dynamic subsetting that generates a font file containing only the characters you need.

The primary approach works much like Google Fonts. Large font files are split into smaller, pre-generated WOFF2 subsets. CSS then lets the browser download only the subsets needed to display the text on the page.

This makes custom typography practical for entire articles and dynamically updated content, without forcing visitors to download every glyph in the font.

For fixed headings, logos, and other short pieces of text, emfont also supports precise dynamic subsetting. It generates a custom font file containing only the specified characters.

A heading of around 100 Chinese characters can fit into a font file of roughly 40 KB, smaller than many thumbnail images on the web. In these fixed, limited-text scenarios, the resulting file can be less than 1% of the original font’s size.

## From a High School Side Project to Millions of Daily Requests

Today, emfont handles around a million requests per day. Its fonts have appeared on websites for Kirin Beer, FIN, universities and colleges, and events including SITCON 2026 and Furry Tea Party 2027.
