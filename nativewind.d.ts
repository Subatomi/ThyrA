/// <reference types="nativewind/types" />

declare module 'nativewind' {
	import * as React from 'react';
	import type { ComponentType } from 'react';

	export const styled: <T extends ComponentType<any>>(component: T) => ComponentType<React.ComponentProps<T> & { className?: string }>;

	export default { styled };
}
