class UnicycleRangeSlider {
  constructor(el) {
    this.wheel  = document.querySelector(`${el} input[type=range]`);
    this.marker = document.querySelector(`${el} .unicycle__marker`);
    this.flag   = document.querySelector(`${el} .unicycle__flag`);

    this.updateBodyPos = this.updateBodyPos.bind(this); // Bind context
    this.wheel.addEventListener("input", this.updateBodyPos);
    this.updateBodyPos();
  }

  updateBodyPos() {
    const { min, max, value: realValue } = this.wheel;
    const ticks = max - min;
    const percent = (realValue - min) / ticks;
    const revs = 1;
    const left = percent * 100;
    const emAdjust = percent * 1.5;
    const pedalRot = percent * (360 * revs);
    const period = (1 / (ticks / revs / 2)) * (realValue - min) * Math.PI;

    const cssVars = {
      "--pedalRot": `${pedalRot}deg`,
      "--rightLegRot": `${-22.5 * Math.sin(period + 1.85 * Math.PI) - 22.5}deg`,
      "--rightLowerLegRot": `${45 * Math.sin(period)}deg`,
      "--leftLegRot": `${-22.5 * Math.sin(period + 2.85 * Math.PI) - 22.5}deg`,
      "--leftLowerLegRot": `${45 * Math.sin(period + Math.PI)}deg`,
    };

    // Position stick figure and unicycle body
    this.marker.style.left = `calc(${left}% - ${emAdjust}em)`;

    // Update the variables in CSS
    Object.entries(cssVars).forEach(([key, value]) => {
      this.marker.style.setProperty(key, value);
    });

    // Number in the flag
    this.flag.innerHTML = realValue;
  }
}