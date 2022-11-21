```
> npm i sprut-circular-json
```

# Sprut-circular-json

Набор функций для работы с JSON с циклическими ссылками. ДАёт возможность перевести в строку, отправить куда следует, и восстановить объект в том же зацикленном виде.

---

<br>

## <span id="contents">Оглавление</span>

- [Перевод в строку и обратно](#convert)
- [Промежуточный результат в виде объекта](#middle)

<br>

## <span id="convert">Перевод в строку и обратно:</span>

- [К оглавлению](#contents)

<br>

```js
const CJSON = require('sprut-circular-json');

const a = { prop: 'value' };

a.ref = a;

const str = CJSON.stringify(a);
const copy_a = CJSON.parse(str);

console.log(str);
// {"value": {"prop": "value", "ref": {"__isJSONCircularRef": true, "ref": "166903917458093014"}}, "ref": "166903917458093014", "__isJSONCircularSource": true}

console.log(a); // <ref *1> { prop: 'value', ref: [Circular *1] }

console.log(copy_a); // <ref *1> { prop: 'value', ref: [Circular *1] }
```

<br>

## <span id="middle">Промежуточный результат в виде объекта:</span>

- [К оглавлению](#contents)

<br>

Также можно извлечь промежуточный преобразованный результат в js-объект до условного ```JSON.stringify(...)```. До преобразования в стркоу. Результат можно подложить куда угодно и работать уже с обычным ```JSON.stringify(...)```.

<br>

```js
const CJSON = require('sprut-circular-json');

const a = { prop: 'value' };

a.ref = a;

const preString = CJSON.resolveCircular(a);

console.log(preString);
// {
//   value: {
//     prop: 'value',
//     ref: { __isJSONCircularRef: true, ref: '1669039721359479104' }
//   },
//   ref: '1669039721359479104',
//   __isJSONCircularSource: true
// }


const b = { prop: 'prop', circular: preString };

console.log(JSON.stringify(b))
// {"prop": "prop", "circular": {"value": {"prop": "value", "ref": {"__isJSONCircularRef": true, "ref": "1669039919146610182"}}, "ref": "1669039919146610182", "__isJSONCircularSource": true}}
```