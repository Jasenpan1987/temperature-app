import * as R from 'ramda';

const msgs = {
  UPDATE_VALUE: "UPDATE_VALUE",
  UPDATE_LEFT_UNIT: "UPDATE_LEFT_UNIT",
  UPDATE_RIGHT_UNIT: "UPDATE_RIGHT_UNIT"
};

function convert(model) {
  const { leftValue, rightValue, leftUnit, rightUnit } = model;

  const [ fromUnit, fromTemp, toUnit ] =
    model.sourceLeft ? [leftUnit, leftValue, rightUnit] : [rightUnit, rightValue, leftUnit];
    
  const otherValue = R.pipe(
    covertFromToTemp,
    Math.round,
  )(fromUnit, toUnit, fromTemp);

  return model.sourceLeft ? 
    { ...model, rightValue: otherValue }:
    { ...model, leftValue: otherValue };
}

function covertFromToTemp(fromUnit, toUnit, temp) {
  const convertFn = R.pathOr(
    R.identity,
    [ fromUnit, toUnit],
    UnitConvertions
  );

  return convertFn(temp);
}

function FtoC(temp) {
  return 5 / 9 * (temp - 32);
}

function CtoF(temp) {
  return 9 / 5 * temp + 32;
}

function KtoC(temp) {
  return temp - 273.15;
}

function CtoK(temp) {
  return temp + 273.15;
}

const FtoK = R.pipe(FtoC, CtoK);
const KtoF = R.pipe(KtoC, CtoF);

const UnitConvertions = {
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK
  },
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK
  },
  Kelvin: {
    Celsius: KtoC,
    Fahrenheit: KtoF
  }
};

export function updateValueMsg(value, isLeftValue) {
  return {
    type: msgs.UPDATE_VALUE,
    value,
    isLeftValue
  };
}

export function updateLeftUnitMsg(leftUnit) {
  return {
    type: msgs.UPDATE_LEFT_UNIT,
    leftUnit
  };
}

export function updateRightUnitMsg(rightUnit) {
  return {
    type: msgs.UPDATE_RIGHT_UNIT,
    rightUnit
  };
}

// const initModel = {
//   leftValue: 0,
//   leftUnit: "Celsius",
//   rightValue: 32,
//   rightUnit: "Fahrenheit",
//   sourceLeft: true
// };

const convertToNum = R.pipe(
  parseInt, R.defaultTo(0)
);

function update (msg, model) {
  switch(msg.type) {
    case msgs.UPDATE_VALUE: {
      if (msg.value === "") {
        return convert(
          msg.isLeftValue ? { ...model, leftValue: "", sourceLeft: true, rightValue: "" } :
            {...model, leftValue: "", sourceLeft: false, rightValue: "" }
        );
      }

      return convert(
        msg.isLeftValue ? { ...model, leftValue: convertToNum(msg.value), sourceLeft: true } :
          { ...model, rightValue: convertToNum(msg.value), sourceLeft: false }
      );
    }
      
    case msgs.UPDATE_LEFT_UNIT: {
      const { leftUnit } = msg;
      return convert({
        ...model,
        leftUnit
      });
    }
    
    case msgs.UPDATE_RIGHT_UNIT: {
      const { rightUnit } = msg;
      return convert({
        ...model,
        rightUnit
      });
    }

    default:
      return model;
  }
}

export default update;
