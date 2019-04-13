export class FilterOptions {
  checkboxes = new CheckboxPropertyList();
  sliders = new SliderPropertyList();

  getObjectOptions(): any {
    let objParams = {};
    for (const propName of Object.keys(this.sliders)) {
      if (this.sliders[propName].isValuesNotDefault()) {
        objParams[propName] = `${this.sliders[propName].lte}-${this.sliders[propName].gte}`;
      }
    }
    for (const propName of Object.keys(this.checkboxes)) {
      this.checkboxes[propName].forEach((elem) => {
        objParams[propName] ? objParams[propName].push(elem.name) : objParams[propName] = [elem.name];
      });
    }
    return objParams;
  }
}

export class Checkbox {
  name: string;
  checked: boolean;
  property?: string;
  constructor(name: string, checked?: boolean) {
    this.name = name;
    this.checked = checked ? checked : false;
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

  isValuesNotDefault(defaultLte?: number, defaultGte?: number): boolean {
    let value = true;
    if (this.lte === 0 && this.gte === 0) {
      value = false;
    }
    if (defaultLte && defaultGte) {
      if (defaultLte === this.lte && defaultGte === this.gte) { // check if value is not primary
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
