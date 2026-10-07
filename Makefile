.PHONY: test typecheck ci bench pair

test:
	bun test

typecheck:
	bunx tsc --noEmit

bench:
	bun bench/run.ts

pair:
	bun experiment/run.ts --site https://www.corgi.insure

ci: test typecheck
