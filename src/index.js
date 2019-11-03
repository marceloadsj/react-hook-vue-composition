import { useState, useCallback, useMemo } from "react";

const refSymbol = Symbol();

/**
 * Get a callback to force update the component
 * @returns {Array} function to update and a different null object on each update
 */
function useForceUpdate() {
  const [updated, setUpdated] = useState();

  const forceUpdate = useCallback(() => setUpdated(Object.create(null)), []);

  return [forceUpdate, updated];
}

/**
 * Set a deep proxy on object param, adding force update to set
 * @param {Object} object
 * @param {Function} forceUpdate
 * @returns {Object} A deep proxied copy of the object argument
 */
function setProxy(object, forceUpdate) {
  Object.keys(object).forEach(key => {
    if (typeof object[key] === "object") {
      object[key] = setProxy({ ...object[key] }, forceUpdate);
    }
  });

  return new Proxy(object, {
    set: (target, property, value) => {
      target[property] = value;

      forceUpdate();

      return true;
    }
  });
}

/**
 * Check if the value argument is a ref object or not
 * @param {object} value
 * @returns {Boolean} check if is ref symbol or not
 */
function isRef(value) {
  return value.__internal__type__ === refSymbol;
}

/**
 * Hook that mimic the vue api with small composable functions
 * @param {Function} setup
 * @returns {*} an object with your setup params
 */
export default function useVueCompositionApi(setup) {
  const [reactiveForceUpdate] = useForceUpdate();
  const [refForceUpdate, refUpdated] = useForceUpdate();

  const data = useMemo(() => {
    function reactive(object) {
      return setProxy({ ...object }, reactiveForceUpdate);
    }

    function ref(value) {
      return setProxy({ value, __internal__type__: refSymbol }, refForceUpdate);
    }

    function toRefs() {}

    return setup({ reactive, ref, isRef });
  }, [setup, reactiveForceUpdate, refForceUpdate]);

  return useMemo(() => {
    return Object.keys(data).reduce((parsedData, key) => {
      if (data[key].__internal__type__ === refSymbol) {
        parsedData[key] = data[key].value;
      } else {
        parsedData[key] = data[key];
      }

      return parsedData;
    }, {});
  }, [refUpdated]);
}
