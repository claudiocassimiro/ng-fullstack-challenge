import { it, describe, expect } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { useWindowSize } from "../helpers";

describe(`useWindowSize`, () => {
  const customGlobal = global;

  it(`test the window dimensions`, () => {
    customGlobal.innerWidth = 500;
    customGlobal.innerHeight = 800;

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(800);
  });

  it(`If screen width is less than 768px, it should return true for isMobile`, () => {
    customGlobal.innerWidth = 360;

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isMobile).toEqual(true);
  });

  it(`If screen height is less than or equal to 612px, it should return true for isHorizontal`, () => {
    customGlobal.innerHeight = 612;

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isHorizontal).toEqual(true);
  });

  it(`If screen width is greater than or equal to 768px and less than 1024px, it must return true for isTablet`, () => {
    customGlobal.innerWidth = 768;
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isTablet).toEqual(true);

    customGlobal.innerWidth = 1023;

    expect(result.current.isTablet).toEqual(true);
  });

  it(`If screen width is greater than or equal to 1024px, it should return true for isDesktop`, () => {
    customGlobal.innerWidth = 1024;

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isDesktop).toEqual(true);
  });
});
