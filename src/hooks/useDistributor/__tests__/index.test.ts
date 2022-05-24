// import { renderHook } from "@testing-library/react-hooks";
import { useDistributors } from "../index";

describe("useDistributor tests", () => {
  it("should be defined", async () => {
    expect(useDistributors).toBeDefined();
  });

  // it("renders the hook correctly and checks types", () => {
  //   const { result } = renderHook(() => useDistributors('39AvmSeyFFbxuKWJhSG53rTK9bQ69Sv9nZ8e6zCCPw18'));
  //   console.log('result', result);
  //   expect(result.current.loading).toBe(false);
  //   // expect(typeof result.current.count).toBe("number");
  //   // expect(typeof result.current.increment).toBe("function");
  // });

  // it("should increment counter", () => {
  //   const { result } = renderHook(() => useCounter());
  //   act(() => {
  //     result.current.increment();
  //   });
  //   expect(result.current.count).toBe(1);
  // });

  // it("should increment counter from custom initial value", () => {
  //   const { result } = renderHook(() => useCounter(10));
  //   act(() => {
  //     result.current.increment();
  //   });
  //   expect(result.current.count).toBe(11);
  // });

  // it("should decrement counter from custom initial value", () => {
  //   const { result } = renderHook(() => useCounter(20));
  //   act(() => {
  //     result.current.decrement();
  //   });
  //   expect(result.current.count).toBe(19);
  // });

  // it("should reset counter to updated initial value", () => {
  //   let initialValue = 0;
  //   const { result, rerender } = renderHook(() => useCounter(initialValue));
  //   initialValue = 10;
  //   rerender();
  //   act(() => {
  //     result.current.reset();
  //   });
  //   expect(result.current.count).toBe(10);
  // });
});
