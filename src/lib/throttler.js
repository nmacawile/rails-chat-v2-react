export default function throttler(fn, interval = 300) {
	let lastTime = 0;
	let timer;

	return (...args) => {
		clearTimeout(timer);
		const now = Date.now();
		const elapsed = now - lastTime;

		if (elapsed >= interval) {
			// If enough time has passed, execute immediately
			fn.apply(this, args);
			lastTime = now;
		} else {
			// Otherwise, schedule for the end of the interval
			timer = setTimeout(() => {
				fn.apply(this, args);
				lastTime = Date.now();
			}, interval - elapsed);
		}
	};
}
