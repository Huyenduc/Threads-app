import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

function getItem(key: string): string | null {
  const value = storage.getString(key);
  return value ? value : null;
}

function setItem(key: string, value: string): void {
  storage.set(key, value);
}

function removeItem(key: string): void {
  storage.remove(key);
}

function subscribe(
  key: string,
  callback: (value: string | null) => void,
): () => void {
  const listener = (changedKey: string) => {
    if (changedKey === key) {
      callback(getItem(key));
    }
  };

  const { remove } = storage.addOnValueChangedListener(listener);

  return () => {
    remove();
  };
}

/**
 * Creates a Jotai atom that is synchronized with MMKV storage.
 * @template T The type of the value stored in the atom.
 * @param {string} key The key used to store the value in MMKV.
 * @param {T} initialValue The initial value of the atom.
 * @returns {import("jotai").Atom<T>} A Jotai atom synchronized with MMKV storage.
 */
export const atomWithMMKV = <T>(key: string, initialValue: T) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => ({
      getItem,
      setItem,
      removeItem,
      subscribe,
    })),
    { getOnInit: true },
  );
