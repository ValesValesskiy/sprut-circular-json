function stringify(object) {
    return JSON.stringify(resolveCircular(object));
}

function resolveCircular(object) {
    const [ links, refs, usage ] = linked(object);

    return  clearUseless(links, refs, usage);
}

function clearUseless(links, refs, usage) {
    if (links && links.__isJSONCircularSource) {
        for(let prop in links.value) {
            links.value[prop] = clearUseless(links.value[prop], refs, usage);
        }

        if (usage[links.ref]) {
            return links;
        } else {
            return links.value;
        }
    } else {
        return links;
    }
}

function linked(object, refs = {}, usage = {}) {
    if (object instanceof Object) {
        for(let ref in refs) {
            if (object === refs[ref]) {
                usage[ref] = true;

                return [{
                    __isJSONCircularRef: true,
                    ref
                }, refs, usage];
            }
        }

        const jsonDescriptor = {
            value: object instanceof Array ? [] : {},
            ref: createRefName(),
            __isJSONCircularSource: true
        };

        refs[jsonDescriptor.ref] = object;

        for(let prop in object) {
            jsonDescriptor.value[prop] = linked(object[prop], refs, usage)[0];
        }

        return [jsonDescriptor, refs, usage];
    } else {
        return [object, refs, usage];
    }
}

function createRefName() {
    return `${new Date().getTime()}${(Math.random() * 10).toFixed(0)}${(Math.random() * 10).toFixed(0)}${(Math.random() * 10).toFixed(0)}${(Math.random() * 10).toFixed(0)}${(Math.random() * 10).toFixed(0)}`;
}

function parse(str) {
    const parsed = JSON.parse(str);
    const refs = restoreRefs(parsed);
    const result = restoreObject(parsed, refs);

    return result;
}

function restoreRefs(object) {
    const refs = {};

    if (object && object.__isJSONCircularSource) {
        refs[object.ref] = object.value;

        for(let prop in object.value) {
            Object.assign(refs, restoreRefs(object.value[prop]));
        }
    }

    return refs;
}

function restoreObject(object, refs) {
    if (object instanceof Object) {
        for(let prop in object) {
            object[prop] = restoreObject(object[prop], refs);
        }

        if (object.__isJSONCircularRef) {
            return refs[object.ref];
        } else if (object.__isJSONCircularSource) {
            return object.value;
        } else {
            return object;
        }
    } else {
        return object;
    }
}

module.exports = {
    stringify,
    resolveCircular,
    parse
}