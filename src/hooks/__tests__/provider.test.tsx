import * as React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react';
import { PngfiProvider } from "../provider";
import { PublicKey } from '@solana/web3.js';

function TestChild({ children } : { children: React.ReactNode }) {
  return (
    <div>
      {children || 'TestChild'}
    </div>
  )
}

describe("PngfiProvider tests", () => {
  it("should be defined", () => {
    expect(PngfiProvider).toBeDefined();
  });
  it('test case', async () => {
    render(
      <PngfiProvider
        cluster="mainnet-beta"
        pngfiApi="https://api-test.png.fi"
        // distributorApi
        // rpcpoolApi
        userPublicKey={new PublicKey("39AvmSeyFFbxuKWJhSG53rTK9bQ69Sv9nZ8e6zCCPw18")}
        options={{
          provider: () => new Map()
        }}>
        <TestChild>
          PngfiProvider
        </TestChild>
      </PngfiProvider>
    )
  });

});
