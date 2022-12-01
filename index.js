function stringify(object) {
    return JSON.stringify(resolveCircular(object));
}

function resolveCircular(object) {
    const [ links, refs, usage ] = linked(object);

    return  clearUseless(links, refs, usage);
}

function clearUseless(links, refs, usage) {
    if (links instanceof Object && '__JSONCircularSource' in links) {
        for(let prop in links.value) {
            links.value[prop] = clearUseless(links.value[prop], refs, usage);
        }

        if (usage[links.__JSONCircularSource]) {
            return links;
        } else {
            return links.value;
        }
    } else {
        return links;
    }
}

function linked(object, refs = {}, usage = {}, currentNodeAlias = '') {
    if (object instanceof Object) {
        if (!(object instanceof Function)) {
            for(let ref in refs) {
                if (object === refs[ref]) {
                    usage[ref] = true;

                    return [{
                        __JSONCircularRef: ref
                    }, refs, usage];
                }
            }

            const jsonDescriptor = {
                value: object instanceof Array ? [] : {},
                __JSONCircularSource: currentNodeAlias
            };

            refs[jsonDescriptor.__JSONCircularSource] = object;

            for(let prop in object) {
                jsonDescriptor.value[prop] = linked(object[prop], refs, usage, `${currentNodeAlias}.${prop}`)[0];
            }

            return [jsonDescriptor, refs, usage];
        }
    }

    return [object, refs, usage];
}

function parse(str) {
    const parsed = JSON.parse(str);
    const refs = restoreRefs(parsed);
    const result = restoreObject(parsed, refs);

    return result;
}

function restoreRefs(object) {
    const refs = {};

    if (object instanceof Object) {
        if ('__JSONCircularSource' in object) {
            refs[object.__JSONCircularSource] = object.value;

            for(let prop in object.value) {
                Object.assign(refs, restoreRefs(object.value[prop]));
            }
        } else {
            for(let prop in object) {
                Object.assign(refs, restoreRefs(object[prop]));
            }
        }
    }

    return refs;
}

function restoreObject(object, refs) {
    if (object instanceof Object) {
        for(let prop in object) {
            object[prop] = restoreObject(object[prop], refs);
        }

        if ('__JSONCircularRef' in object) {
            return refs[object.__JSONCircularRef];
        } else if ('__JSONCircularSource' in object) {
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