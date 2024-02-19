import { Item } from "./gilded-rose";

const QUALITY_LIMIT = { MIN: 0, MAX: 50 } as const;

const clamp = (value: number) =>
  Math.min(Math.max(value, QUALITY_LIMIT.MIN), QUALITY_LIMIT.MAX);

export abstract class ItemUpdater {
  protected get canChangeSellIn(): boolean {
    return !this.sealed;
  }

  protected get canChangeQuality(): boolean {
    return (
      !this.sealed &&
      this.item.quality > QUALITY_LIMIT.MIN &&
      this.item.quality < QUALITY_LIMIT.MAX
    );
  }

  protected get sellIn(): number {
    return this.item.sellIn;
  }

  protected get quality(): number {
    return this.item.quality;
  }

  constructor(private item: Item, protected sealed = false) {}

  protected setQuality(value: number) {
    if (this.sealed) return;

    this.item.quality = clamp(value);
  }

  protected changeQuality(delta: number) {
    if (!this.canChangeQuality) return;

    this.setQuality(this.item.quality + delta);
  }

  protected changeSellIn(delta: number) {
    if (!this.canChangeSellIn) return;

    this.item.sellIn = this.item.sellIn + delta;
  }

  abstract updateQuality(): void;

  updateItem(days = 1): void {
    if (this.sealed) return;

    for (let i = 0; i < days; i++) {
      this.changeSellIn(-1);
      this.updateQuality();
    }
  }
}

export class NormalUpdater extends ItemUpdater {
  updateQuality() {
    if (this.sellIn < 0) {
      this.changeQuality(-2);
    } else {
      this.changeQuality(-1);
    }
  }
}

export class AgedBrieUpdater extends ItemUpdater {
  updateQuality() {
    this.changeQuality(1);
  }
}

export class SulfurasUpdater extends ItemUpdater {
  constructor(item: Item) {
    super(item, true);
  }

  updateQuality() {}
}

export class BackstagePassesUpdater extends ItemUpdater {
  updateQuality() {
    if (this.sellIn < 0) {
      this.setQuality(0);
    } else if (this.sellIn < 6) {
      this.changeQuality(3);
    } else if (this.sellIn < 11) {
      this.changeQuality(2);
    } else {
      this.changeQuality(1);
    }
  }
}

export class ConjuredUpdater extends ItemUpdater {
  updateQuality() {
    this.changeQuality(-2);
  }
}

export const itemUpdaterCreator = (item: Item) => {
  if (item.name.startsWith("Aged Brie")) return new AgedBrieUpdater(item);
  if (item.name.startsWith("Backstage passes"))
    return new BackstagePassesUpdater(item);
  if (item.name.startsWith("Sulfuras")) return new SulfurasUpdater(item);
  if (item.name.startsWith("Conjured")) return new ConjuredUpdater(item);

  return new NormalUpdater(item);
};
