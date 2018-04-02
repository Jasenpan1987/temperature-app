import * as R from 'ramda';

const msgs = {
  UPDATE_VALUE: "UPDATE_VALUE",
  UPDATE_LEFT_UNIT: "UPDATE_LEFT_UNIT",
  UPDATE_RIGHT_UNIT: "UPDATE_RIGHT_UNIT"
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
        return (
          msg.isLeftValue ? { ...model, leftValue: "", sourceLeft: true, rightValue: "" } :
            {...model, leftValue: "", sourceLeft: false, rightValue: "" }
        );
      }

      return (
        msg.isLeftValue ? { ...model, leftValue: convertToNum(msg.value), sourceLeft: true } :
          { ...model, rightValue: convertToNum(msg.value), sourceLeft: false }
      );
    }
      
    case msgs.UPDATE_LEFT_UNIT: {
      const { leftUnit } = msg;
      return {
        ...model,
        leftUnit
      };
    }
    
    case msgs.UPDATE_RIGHT_UNIT: {
      const { rightUnit } = msg;
      return {
        ...model,
        rightUnit
      };
    }

    default:
      return model;
  }
}

export default update;
