import { useState, useCallback, useMemo, useEffect, useRef } from "react";

const refSymbol = Symbol("refSymbol");

let currentlyWatchEffect;

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
 * Get the set function to use inside the proxy
 * @param {Set} watchers
 * @param {Function} forceUpdate
 * @returns {Function} The setter function
 */
function getSet(watchers, forceUpdate) {
  return (target, property, value) => {
    let prevValue;

    if (isRef(target[property])) {
      prevValue = target[property].value;

      target[property].value = value;
    } else {
      prevValue = target[property];

      target[property] = value;
    }

    forceUpdate();

    watchers.forEach(watch => watch(prevValue));

    return true;
  };
}

/**
 * Get the get function to use inside the proxy
 * @param {Set} watchers
 * @returns {Function} The getter function
 */
function getGet(watchers) {
  return (target, property) => {
    if (currentlyWatchEffect) {
      const effect = currentlyWatchEffect;
      watchers.add(effect);

      currentlyWatchEffect = () => watchers.delete(effect);
    }

    if (isRef(target[property])) {
      return target[property].value;
    }

    return target[property];
  };
}

/**
 * Set a deep proxy on object param, adding force update to set
 * @param {Object} object
 * @param {Function} forceUpdate
 * @returns {Object} A deep proxied copy of the object argument
 */
function setProxy(object, forceUpdate) {
  const objectClone = isRef(object) ? object : { ...object };

  Object.keys(objectClone).forEach(key => {
    if (typeof objectClone[key] === "object") {
      objectClone[key] = setProxy(objectClone[key], forceUpdate);
    }
  });

  const watchers = new Set();

  return new Proxy(objectClone, {
    set: getSet(watchers, forceUpdate),
    get: getGet(watchers)
  });
}

/**
 * Check if the value argument is a ref object or not
 * @param {object} value
 * @returns {Boolean} check if is ref symbol or not
 */
function isRef(value) {
  return value && value.__internal__type__ === refSymbol;
}

/**
 * Hook that mimic the vue api with small composable functions
 * @param {Function} setup
 * @returns {*} an object with your setup params
 */
export default function useVueCompositionApi(setup) {
  const [reactiveForceUpdate] = useForceUpdate();
  const [refForceUpdate, refUpdated] = useForceUpdate();

  const watcherStopsRef = useRef();
  if (!watcherStopsRef.current) watcherStopsRef.current = new Set();

  const data = useMemo(() => {
    function reactive(object) {
      return setProxy(object, reactiveForceUpdate);
    }

    function ref(value) {
      return setProxy({ value, __internal__type__: refSymbol }, refForceUpdate);
    }

    function watch(effect, options) {
      if (typeof options === "function") {
        if (isRef(effect)) {
          currentlyWatchEffect = prev => options(effect.value, prev);
        } else {
          currentlyWatchEffect = prev => options(effect(), prev);
        }
      } else {
        currentlyWatchEffect = () => effect();
      }

      currentlyWatchEffect();

      const stop = currentlyWatchEffect;
      currentlyWatchEffect = undefined;

      watcherStopsRef.current.add(stop);

      return () => {
        watcherStopsRef.current.delete(stop);
        stop();
      };
    }

    return setup({ reactive, ref, isRef, watch });
  }, [setup, reactiveForceUpdate, refForceUpdate]);

  useEffect(() => {
    return () => watcherStopsRef.forEach(stop => stop());
  }, []);

  return useMemo(() => {
    return Object.keys(data).reduce((parsedData, key) => {
      if (isRef(data[key])) {
        parsedData[key] = data[key].value;
      } else {
        parsedData[key] = data[key];
      }

      return parsedData;
    }, {});
  }, [refUpdated]);
}
