## Breadfish++ Screenshot Service
Diese APP benötigt folgende **Umgebungsvariablen**:


#### `WIDTH_POST`
Breite in Pixeln für Post Screenshots.
Standardwert ist `1024`.

#### `WIDTH_THREAD`
Breite in Pixeln für Thread Screenshots.
Standardwert ist `1280`.

#### `IMAGE_QUALITY`
Die Bildqualität in % (`1` - `100`). Bessere Qualität = Größere Datei.
Standardwert ist `50`.

#### `CACHE_TTL`
Die zeit in *Millisekunden* für wie lange ein Bild gecached werden soll.
Standardwert ist `3600000`.

#### `USER_AGENT`
Der User-Agent der beim Aufrufen der Seite genutzt werden soll.
Kein Standartwert.

#### `PORT`
Der HTTP-Port über den man die APP erreichen soll.
Kein Standartwert.

#### `DEBUG`
Siehe [debug](https://github.com/visionmedia/debug).
Kein Standardwert.

## License
The MIT License (MIT)

Copyright (c) 2016 Martin Rump

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
