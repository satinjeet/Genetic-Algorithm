class Gene {

    static generate(length) {
        let v = "";
        while(length) {
            v += String.fromCharCode(Math.floor(Math.random() * 255));
            length--;
        }
        return new Gene(v);
    }

    constructor(public value: string = "") {}

    mutate(chance: number): void {
        let ac: number = Math.floor(Math.random() * 100);

        if (chance > ac) return;

        let index = Math.floor(Math.random() * this.value.length);
        let upOrDown = Math.random() <= 0.5 ? -1 : 1;
        let newValue: string = "";

        for (let i = 0; i < this.value.length; i++) {
            if (i == index) {
                newValue += String.fromCharCode(
                    this.value[i].charCodeAt() + upOrDown
                );
            } else {
                newValue += this.value[i];
            }
        }
    
        this.value = newValue;
    }


    mate(partner: Gene, offset: number = this.value.length / 2): Gene[] {
        offset = Math.floor(offset);
        return [
            new Gene(this.value.substring(0, offset) + partner.value.substring(offset)),
            new Gene(this.value.substring(offset) + partner.value.substring(0, offset))
        ]
    }

    cost(target: string) {
        let c = 0;

        for (let i = 0 ; i < this.value.length; i++) {
            let diff = this.value[i].charCodeAt() - target[i].charCodeAt();

            c += (diff * diff);
        }

        return c;
    }
}

class World {
    public ppl: Gene[] = [];
    public target: string = "";
    public generation = 0;

    constructor(population_count: number, target: string = "") {
        this.target = target;
        while(population_count) {
            this.ppl.push(Gene.generate(target.length));
            population_count--;
        }

        console.log(this);
    }

    boot(timer) {
        if(this.ppl[0].cost(this.target) > 0) {
            this._boot();
        } else {
            clearInterval(timer);
        }
    }

    _boot () {
        
        this.ppl.sort((g1, g2) => {
            return g1.cost(this.target) < g2.cost(this.target) ? -1 : 1;
        })

        let [g1,g2] = this.ppl[0].mate(this.ppl[1]);
        this.ppl.splice(this.ppl.length -2, 2);
        this.ppl.unshift(g2);
        this.ppl.unshift(g1);
        
        this.ppl.sort((g1, g2) => {
            return g1.cost(this.target) < g2.cost(this.target) ? -1 : 1;
        })
        

        this.ppl.forEach((g: Gene) => {
            g.mutate(30);
        })



        let html: string = `<li>Generation : ${++this.generation}</li>`;

        this.ppl.slice(0, 25).forEach((g: Gene) => {
            html += `<li>${g.cost(this.target)} ${g.value}</li>`;
        })

        document.querySelector('#generation').innerHTML = html;
    }
}