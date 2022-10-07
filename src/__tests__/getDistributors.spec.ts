import { getDistributors } from '../common/pngfi-merkle-rewards-api';

const callback = (fn: any) => {
  const user = '39AvmSeyFFbxuKWJhSG53rTK9bQ69Sv9nZ8e6zCCPw18';
  const func = setInterval(async () => {
    fn({ name: 'callback' });
    try {
      const distributors = await getDistributors(user);
      console.log('distributors', distributors.length);
      expect(distributors.length).toBe(2);
    } catch (err) {
      clearInterval(func);
    }
  }, 50);
};

describe('getDistributors module', () => {
  jest.useFakeTimers();
  test('getDistributors', () => {
    const fn = jest.fn();
    callback(fn);
    jest.runOnlyPendingTimers();
    expect(fn).toBeCalled();
    jest.advanceTimersByTime(30000);
    console.log('run', 30000 / 50 + 1, 'times');
    expect(fn).toHaveBeenCalledTimes(30000 / 50 + 1);
  });
});
