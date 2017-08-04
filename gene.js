var Gene = (function () {
    function Gene(value) {
        if (value === void 0) { value = ""; }
        this.value = value;
    }
    Gene.generate = function (length) {
        var v = "";
        while (length) {
            v += String.fromCharCode(Math.floor(Math.random() * 255));
            length--;
        }
        return new Gene(v);
    };
    Gene.prototype.mutate = function (chance) {
        var ac = Math.floor(Math.random() * 100);
        if (chance > ac)
            return;
        var index = Math.floor(Math.random() * this.value.length);
        var upOrDown = Math.random() <= 0.5 ? -1 : 1;
        var newValue = "";
        for (var i = 0; i < this.value.length; i++) {
            if (i == index) {
                newValue += String.fromCharCode(this.value[i].charCodeAt() + upOrDown);
            }
            else {
                newValue += this.value[i];
            }
        }
        this.value = newValue;
    };
    Gene.prototype.mate = function (partner, offset) {
        if (offset === void 0) { offset = this.value.length / 2; }
        offset = Math.floor(offset);
        return [
            new Gene(this.value.substring(0, offset) + partner.value.substring(offset)),
            new Gene(this.value.substring(offset) + partner.value.substring(0, offset))
        ];
    };
    Gene.prototype.cost = function (target) {
        var c = 0;
        for (var i = 0; i < this.value.length; i++) {
            var diff = this.value[i].charCodeAt() - target[i].charCodeAt();
            c += (diff * diff);
        }
        return c;
    };
    return Gene;
}());
var World = (function () {
    function World(population_count, target) {
        if (target === void 0) { target = ""; }
        this.ppl = [];
        this.target = "";
        this.generation = 0;
        this.target = target;
        while (population_count) {
            this.ppl.push(Gene.generate(target.length));
            population_count--;
        }
        console.log(this);
    }
    World.prototype.boot = function (timer) {
        if (this.ppl[0].cost(this.target) > 0) {
            this._boot();
        }
        else {
            clearInterval(timer);
        }
    };
    World.prototype._boot = function () {
        var _this = this;
        this.ppl.sort(function (g1, g2) {
            return g1.cost(_this.target) < g2.cost(_this.target) ? -1 : 1;
        });
        var _a = this.ppl[0].mate(this.ppl[1]), g1 = _a[0], g2 = _a[1];
        this.ppl.splice(this.ppl.length - 2, 2);
        this.ppl.unshift(g2);
        this.ppl.unshift(g1);
        this.ppl.sort(function (g1, g2) {
            return g1.cost(_this.target) < g2.cost(_this.target) ? -1 : 1;
        });
        this.ppl.forEach(function (g) {
            g.mutate(30);
        });
        var html = "<li>Generation : " + ++this.generation + "</li>";
        this.ppl.slice(0, 25).forEach(function (g) {
            html += "<li>" + g.cost(_this.target) + " " + g.value + "</li>";
        });
        document.querySelector('#generation').innerHTML = html;
    };
    return World;
}());
