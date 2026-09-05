import { describe, it, expect } from "vitest";
import { applyMovement, isLowStock } from "../stock";

describe("applyMovement - in", () => {
  it("入庫で在庫が増える", () => {
    expect(applyMovement(10, "in", 5)).toEqual({ quantity: 15, delta: 5 });
  });
  it("入庫量は絶対値で扱う", () => {
    expect(applyMovement(10, "in", -5)).toEqual({ quantity: 15, delta: 5 });
  });
});

describe("applyMovement - out", () => {
  it("出庫で在庫が減る", () => {
    expect(applyMovement(10, "out", 3)).toEqual({ quantity: 7, delta: -3 });
  });
  it("在庫を超える出庫はエラー", () => {
    expect(() => applyMovement(2, "out", 5)).toThrow("INSUFFICIENT_STOCK");
  });
  it("ちょうど在庫分の出庫は0になる", () => {
    expect(applyMovement(5, "out", 5)).toEqual({ quantity: 0, delta: -5 });
  });
});

describe("applyMovement - adjust", () => {
  it("棚卸で目標値に補正し差分をdeltaに返す（減）", () => {
    expect(applyMovement(10, "adjust", 8)).toEqual({ quantity: 8, delta: -2 });
  });
  it("棚卸で目標値に補正し差分をdeltaに返す（増）", () => {
    expect(applyMovement(10, "adjust", 13)).toEqual({ quantity: 13, delta: 3 });
  });
  it("負の目標値はエラー", () => {
    expect(() => applyMovement(10, "adjust", -1)).toThrow("INVALID_AMOUNT");
  });
});

describe("applyMovement - invalid", () => {
  it("NaN はエラー", () => {
    expect(() => applyMovement(10, "in", NaN)).toThrow("INVALID_AMOUNT");
  });
});

describe("isLowStock", () => {
  it("発注点以下は低在庫", () => {
    expect(isLowStock(3, 5)).toBe(true);
    expect(isLowStock(5, 5)).toBe(true);
  });
  it("発注点超は正常", () => {
    expect(isLowStock(6, 5)).toBe(false);
  });
});
