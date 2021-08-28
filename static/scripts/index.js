const RATIOS_BY_VINEGAR_TYPE = Object.freeze({
    // source (in Polish): https://kukbuk.pl/artykuly/jak-zrobic-blyskawiczne-pikle/
    wine: Object.freeze({
        vinegarPercentage: 6,
        vinegar: 350,
        water: 450,
        sugar: 70,
        salt: 20,
    }),
    spirit: Object.freeze({
        vinegarPercentage: 10,
        vinegar: 200,
        water: 600,
        sugar: 100,
        salt: 20,
    }),
});

const vinegarSetupElement = document.getElementById('vinegar-setup');
const typeElements = Array.from(document.getElementsByName('vinegarType'));
const percentageElement = document.getElementsByName('vinegarPercentage')[0];
const proportionsElement = document.getElementById('proportions');
const waterElement = document.getElementsByName('water')[0];
const vinegarElement = document.getElementsByName('vinegar')[0];
const sugarElement = document.getElementsByName('sugar')[0];
const saltElement = document.getElementsByName('salt')[0];
const totalElement = document.getElementsByName('total')[0];

function setSteppyValue (element, value)
{
    const newValue =
        (value === '' || Number.isNaN(value))
            ? ''
            : value - (value % element.step);
    // eslint-disable-next-line no-param-reassign
    element.value = newValue;
}

const values = {
    get vinegarType () {
        return typeElements.find((e) => e.checked)?.value;
    },
    set vinegarType (value) {
        typeElements.find((e) => e.value === value).checked = true;
    },

    get vinegarPercentage () {
        return percentageElement.valueAsNumber;
    },
    set vinegarPercentage (value) {
        setSteppyValue(percentageElement, value);
    },

    get water () {
        return waterElement.valueAsNumber;
    },
    set water (value) {
        setSteppyValue(waterElement, value);
    },

    get vinegar () {
        return vinegarElement.valueAsNumber;
    },
    set vinegar (value) {
        setSteppyValue(vinegarElement, value);
    },

    get sugar () {
        return sugarElement.valueAsNumber;
    },
    set sugar (value) {
        setSteppyValue(sugarElement, value);
    },

    get salt () {
        return saltElement.valueAsNumber;
    },
    set salt (value) {
        setSteppyValue(saltElement, value);
    },

    get total () {
        return totalElement.valueAsNumber;
    },
    set total (value) {
        setSteppyValue(totalElement, value);
    },
};

function getRatios (vinegarType, newVinegarPercentage)
{
    const { vinegarPercentage, ...ratios } =
        RATIOS_BY_VINEGAR_TYPE[vinegarType];

    const newVinegar =
        ratios.vinegar / (newVinegarPercentage / vinegarPercentage);
    const newAdditionalWater = ratios.vinegar - newVinegar;

    const total =
        Object.values(ratios).reduce((sum, value) => sum + value, 0);

    return {
        ...ratios,
        vinegar: newVinegar,
        water: ratios.water + newAdditionalWater,
        total,
    };
}

function getDefaultVinegarPercentage (vinegarType)
{
    return RATIOS_BY_VINEGAR_TYPE[vinegarType].vinegarPercentage;
}

function handleProportionChange (sourceName)
{
    const sourceValue = values[sourceName];
    const ratios =
        getRatios(values.vinegarType, values.vinegarPercentage);

    Array.from(proportionsElement.elements)
        .map((e) => e.name)
        .filter((name) => name !== sourceName)
        .forEach((otherName) => {
            const ratio = ratios[otherName] / ratios[sourceName];
            values[otherName] = sourceValue * ratio;
        });
}

vinegarSetupElement.addEventListener('input', (event) => {
    if (event.target.name === 'vinegarType')
    {
        values.vinegarPercentage =
            getDefaultVinegarPercentage(event.target.value);
    }

    handleProportionChange('total');
});

proportionsElement.addEventListener('input', (event) => {
    handleProportionChange(event.target.name);
});

handleProportionChange('total');
