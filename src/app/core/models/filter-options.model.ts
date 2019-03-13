export class FilterOptions {
  checkboxes = new CheckboxPropertyList();
  sliders = new SliderPropertyList();
}

export class Checkbox {
  name: string;
  checked: boolean;
  property?: string;
  constructor(name) {
    this.name = name;
    this.checked = false;
  }
}

export class Slider {
  lte: number;
  gte: number;
  constructor(lte = 0, gte = 0) {
    this.setValues(lte, gte);
  }

  setValues(lte, gte): void {
    this.lte = lte;
    this.gte = gte;
  }

  checkValues(receivedSlider?: Slider): boolean {
    let value = true;
    if (this.lte === 0 && this.gte === 0) {
      value = false;
    }
    if (receivedSlider) {
      if (receivedSlider.lte === this.lte && receivedSlider.gte === this.gte) { // check if value is not primary
        value = false;
      }
    }
    return value;
  }
}

export class CheckboxPropertyList {
  manufacturer: Checkbox[] = [];
  camera: Checkbox[] = [];

  getCheckboxList(): Checkbox[] {
    const checkboxList: Checkbox[] = [];
    for (const property of Object.keys(this)) {
      if (this[property] instanceof Array) {
        this[property].forEach(checkbox => {
           checkbox.property = property;
          checkboxList.push(checkbox);
        });
      }
    }
    return checkboxList;
  }
}

export class SliderPropertyList {
  price = new Slider();
}
