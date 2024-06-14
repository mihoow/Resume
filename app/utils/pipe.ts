/*
    Inspired by how RxJS does it: https://github.com/ReactiveX/rxjs/blob/f174d38554d404f21f98ab1079a101e80d777e95/src/internal/Observable.ts#L338-L404
    Yes, it's ugly but it gets the job done
*/

type FirstOperator<R> = () => R;
type OperatorFunction<T, R> = (arg: T) => R;

export function pipe<T>(): T;
export function pipe<A>(op1: FirstOperator<A>): A;
export function pipe<A, B>(op1: FirstOperator<A>, op2: OperatorFunction<A, B>): B;
export function pipe<A, B, C>(op1: FirstOperator<A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): C;
export function pipe<A, B, C, D>(
  op1: FirstOperator<A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>
): D;
export function pipe<A, B, C, D, E>(
  op1: FirstOperator<A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>
): E;
export function pipe<A, B, C, D, E, F>(
  op1: FirstOperator<A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>
): F;
export function pipe<A, B, C, D, E, F, G>(
  op1: FirstOperator<A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  op1: FirstOperator<A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  op1: FirstOperator<A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>,
  op9: OperatorFunction<H, I>
): I;
export function pipe<A, B, C, D, E, F, G, H, I>(
  op1: FirstOperator<A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>,
  op9: OperatorFunction<H, I>,
  ...operations: OperatorFunction<any, any>[]
): unknown;

export function pipe(...operations: OperatorFunction<any, any>[]): any {
  return operations.reduce((acc, fn) => fn(acc), null);
}
