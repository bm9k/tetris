function shuffle(array: any[]): void {
  // implementation of fisher-yates shuffle
  // see https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // swap
    const tmp = array[j];
    array[j] = array[i];
    array[i] = tmp;
  }
}

export class SevenBagGenerator {
  readonly keys: string[]
  bag: string[]
  next: number

  constructor(keys: string[]) {
    this.keys = keys;
    this.bag = [...keys];

    this.next = 0;
    this.fillBag();
  }

  fillBag() {
    this.next = 0;
    shuffle(this.bag);
  }

  peek() {
    return this.bag[this.next];
  }

  take() {
    const result = this.bag[this.next++];

    if (this.next === this.bag.length) {
      this.fillBag();
    }

    return result;
  }
}