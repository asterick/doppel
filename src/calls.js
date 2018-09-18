function pop(hostname, vectors) {
	vectors.pop();
	return this.pop();
}

function push(hostname, vectors, ... args) {
	for (let _ of args) {
		vectors.push( [ 0, hostname ] );
	}
	
	return this.push(... args);
}

function reverse(hostname, vectors) {
	for (let [i, vector] of Object.entries(vectors)) {
		vectors[i] = [ vector[0] + 1, hostname ];
	}

	return this.reverse();
}

function shift(hostname, vectors) {
	const ret = this.shift();

	vectors.shift();

	for (let [i, vector] of Object.entries(vectors)) {
		vectors[i] = [ vector[0] + 1, hostname ];
	}

	return ret;
}

function unshift(hostname, vectors, ... args) {
	const ret = this.unshift(... args);

	for (let [i, vector] of Object.entries(vectors)) {
		vectors[i] = [ vector[0] + 1, hostname ];
	}

	while (vectors.length < this.length) {
		vectors.push([0, hostname]);
	}
	
	return ret;
}

function splice(hostname, vectors, start, count, ... items) {
	const ret = this.splice(start, count, ... items);

	// Increment shifted items
	for (let i = start; i < vectors.length; i++) {
		vectors[start] = [ vectors[start][0] + 1, hostname ];
	}

	while (vectors.length < this.length) {
		vectors.push([0, hostname]);
	}

	return ret;
}

function fill(hostname, vectors, value, start, end) {
	if (typeof start !== 'number') start = 0;
	if (start < 0) start = this.length + start;

	if (typeof end !== 'number') end = this.length;
	if (end < 0) end = this.length + end;

	
	for (let i = start; i < end; i++) {
		if (i >= vectors.length) break ;

		vectors[i] = [ vectors[i][0] + 1, hostname ];
	}

	return this.fill(value, start, end);
}

function copyWithin(hostname, vectors, target, start, end) {
	if (typeof start !== 'number') start = 0;
	if (start < 0) start = this.length + start;

	if (typeof end !== 'number') end = this.length;
	if (end < 0) end = this.length + end;

	for (let length = end - start, index = target; length > 0; length--, index++) {
		if (target >= vectors.length) break ;

		vectors[index] = [ vectors[index][0] + 1, hostname ];
	}

	return this.copyWithin(target, start, end);
}

const CallNames = {
	array_copyWithin: { type: 'inplace', prototype: Array.prototype.copyWithin, funct: copyWithin },
	array_fill: { type: 'inplace', prototype: Array.prototype.fill, funct: fill },
	array_pop: { type: 'inplace', prototype: Array.prototype.pop, funct: pop },
	array_push: { type: 'inplace', prototype: Array.prototype.push, funct: push },
	array_reverse: { type: 'inplace', prototype: Array.prototype.reverse, funct: reverse },
	array_shift: { type: 'inplace', prototype: Array.prototype.shift, funct: shift },
	array_splice: { type: 'inplace', prototype: Array.prototype.splice, funct: splice },
	array_unshift: { type: 'inplace', prototype: Array.prototype.unshift, funct: unshift },
	
	// Heavy weight functions that cannot be safely serialized, so inplace is taken as is
	array_sort: { type: 'replace', prototype: Array.prototype.sort },
}

const CallFunctions = new WeakMap();

for (let [key, bypass] of Object.entries(CallNames)) {
	CallNames[key].name = key;
	CallFunctions.set(bypass.prototype, bypass);
}

module.exports = {
	CallFunctions,
	CallNames
};