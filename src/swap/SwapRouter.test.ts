import { SwapRouter } from './SwapRouter';
import { ValidationError } from '../utils/errors';

describe('SwapRouter', () => {
  let router: SwapRouter;

  beforeEach(() => {
    router = new SwapRouter('https://api.test.com');
  });

  describe('findRoute', () => {
    it('should find swap route', async () => {
      const route = await router.findRoute({
        inputMint: 'a'.repeat(40),
        outputMint: 'b'.repeat(40),
        amount: '1000',
        slippageTolerance: 1.0,
        userAddress: 'c'.repeat(40),
      });

      expect(route).toBeDefined();
      expect(route.routeId).toBeDefined();
      expect(route.inputAmount).toBe('1000');
      expect(parseFloat(route.outputAmount)).toBeGreaterThan(0);
      expect(route.pools.length).toBeGreaterThan(0);
    });

    it('should throw error with invalid input mint', async () => {
      await expect(
        router.findRoute({
          inputMint: 'invalid',
          outputMint: 'b'.repeat(40),
          amount: '1000',
          slippageTolerance: 1.0,
          userAddress: 'c'.repeat(40),
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw error with invalid amount', async () => {
      await expect(
        router.findRoute({
          inputMint: 'a'.repeat(40),
          outputMint: 'b'.repeat(40),
          amount: 'invalid',
          slippageTolerance: 1.0,
          userAddress: 'c'.repeat(40),
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw error with same input and output tokens', async () => {
      const token = 'a'.repeat(40);
      await expect(
        router.findRoute({
          inputMint: token,
          outputMint: token,
          amount: '1000',
          slippageTolerance: 1.0,
          userAddress: 'c'.repeat(40),
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw error with invalid slippage', async () => {
      await expect(
        router.findRoute({
          inputMint: 'a'.repeat(40),
          outputMint: 'b'.repeat(40),
          amount: '1000',
          slippageTolerance: 150, // Invalid: > 100
          userAddress: 'c'.repeat(40),
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('findRoutes', () => {
    it('should find multiple routes', async () => {
      const routes = await router.findRoutes(
        {
          inputMint: 'a'.repeat(40),
          outputMint: 'b'.repeat(40),
          amount: '1000',
          slippageTolerance: 1.0,
          userAddress: 'c'.repeat(40),
        },
        3
      );

      expect(routes).toBeDefined();
      expect(routes.length).toBe(3);
      
      // Routes should be sorted by output amount
      for (let i = 0; i < routes.length - 1; i++) {
        const current = parseFloat(routes[i].outputAmount);
        const next = parseFloat(routes[i + 1].outputAmount);
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });
  });

  describe('executeSwap', () => {
    it('should execute swap', async () => {
      const route = await router.findRoute({
        inputMint: 'a'.repeat(40),
        outputMint: 'b'.repeat(40),
        amount: '1000',
        slippageTolerance: 1.0,
        userAddress: 'c'.repeat(40),
      });

      const result = await router.executeSwap(route);

      expect(result).toBeDefined();
      expect(result.signature).toBeDefined();
      expect(result.status).toBe('success');
      expect(result.inputAmount).toBe(route.inputAmount);
    });

    it('should throw error with invalid route', async () => {
      await expect(
        router.executeSwap({} as any)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getSwapStatus', () => {
    it('should get swap status', async () => {
      const signature = 'a'.repeat(64);
      const status = await router.getSwapStatus(signature);

      expect(status).toBeDefined();
      expect(status.signature).toBe(signature);
      expect(status.status).toBeDefined();
    });

    it('should throw error with empty signature', async () => {
      await expect(router.getSwapStatus('')).rejects.toThrow(ValidationError);
    });
  });
});
