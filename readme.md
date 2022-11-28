```
> npm i sprut-circular-json
```

# Sprut-circular-json

Набор функций для работы с JSON с циклическими ссылками. Даёт возможность перевести в строку, отправить куда следует, и восстановить объект в том же зацикленном виде.

---

<br>

```
В репозитории есть change_log.md с описанием изменений.
```

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
// {"value": {"prop": "value", "ref": {"__JSONCircularRef": ""}}, "__JSONCircularSource": ""}

console.log(a); // <ref *1> { prop: 'value', ref: [Circular *1] }

console.log(copy_a); // <ref *1> { prop: 'value', ref: [Circular *1] }
```

<br>

## <span id="middle">Промежуточный результат в виде объекта:</span>

- [К оглавлению](#contents)

<br>

Также можно извлечь промежуточный преобразованный результат в js-объект до условного ```JSON.stringify(...)```. До преобразования в строку. Результат можно подложить куда угодно и работать уже с обычным ```JSON.stringify(...)```.

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
//     ref: { __JSONCircularRef: '' }
//   },
//   __JSONCircularSource: ''
// }


const b = { prop: 'prop', circular: preString };

console.log(JSON.stringify(b))
// { "prop": "prop", "circular": { "value": { "prop": "value", "ref": { "__JSONCircularRef": "" } },"__JSONCircularSource": "" } }
```