import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const deployedPages = ["index.html", "quote.html", "event-quote-request.html"];

async function read(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

test("quote CSP permits only the required cross-origin submission service", async () => {
  const quote = await read("quote.html");
  const csp = quote.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];

  assert.ok(csp, "quote page must define a Content Security Policy");
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /connect-src 'self' https:\/\/formsubmit\.co;/);
  assert.doesNotMatch(csp, /connect-src[^;]*\*/);
  assert.match(csp, /form-action 'self'/);

  const endpoint = quote.match(/const formSubmitEndpoint = "([^"]+)"/)?.[1];
  assert.ok(endpoint, "quote page must define a submission endpoint");
  assert.equal(new URL(endpoint).origin, "https://formsubmit.co");
});

test("submission success fails closed and exposes retry states", async () => {
  const quote = await read("quote.html");
  const acceptanceFunctionSource = quote.match(/function submissionWasAccepted\(response, result\) \{[\s\S]*?\n      \}/)?.[0];

  assert.match(quote, /contentType\.toLowerCase\(\)\.includes\("application\/json"\)/);
  assert.ok(acceptanceFunctionSource, "acceptance predicate must be present");
  const submissionWasAccepted = vm.runInNewContext(`(${acceptanceFunctionSource})`);
  assert.equal(submissionWasAccepted({ ok: true }, {}), false);
  assert.equal(submissionWasAccepted({ ok: true }, { success: false }), false);
  assert.equal(submissionWasAccepted({ ok: true }, { success: "false" }), false);
  assert.equal(submissionWasAccepted({ ok: false }, { success: true }), false);
  assert.equal(submissionWasAccepted({ ok: true }, { success: true }), true);
  assert.equal(submissionWasAccepted({ ok: true }, { success: "true" }), true);
  assert.match(quote, /const accepted = submissionWasAccepted\(resp, result\)/);
  assert.doesNotMatch(quote, /!Object\.prototype\.hasOwnProperty\.call\(result, "success"\)/);
  assert.match(quote, /new AbortController\(\)/);
  assert.match(quote, /submissionController\.abort\(\), 15000/);
  assert.match(quote, /Retry available in 3s/);
  assert.match(quote, /requestBtn\.textContent = "Try Again"/);
  assert.doesNotMatch(quote, /ops received your request/i);
});

test("submission feedback retains validation, honeypot, and accessible state", async () => {
  const quote = await read("quote.html");

  assert.match(quote, /name="company_url"[^>]*tabindex="-1"[^>]*aria-hidden="true"/);
  assert.match(quote, /if \(!runValidation\(\{ report: true, scroll: true \}\)\)/);
  assert.match(quote, /intakeForm\.setAttribute\("aria-busy", "true"\)/);
  assert.match(quote, /requestBtn\.setAttribute\("aria-busy", "true"\)/);
  assert.match(quote, /toast\.setAttribute\("role", isError \? "alert" : "status"\)/);
  assert.match(quote, /toast\.setAttribute\("aria-live", isError \? "assertive" : "polite"\)/);
  assert.match(quote, /prefers-reduced-motion: reduce/);
});

test("unverified certification claim is absent from every deployed page", async () => {
  for (const page of deployedPages) {
    const html = await read(page);
    assert.doesNotMatch(html, /Act[- ]235/i, `${page} must not publish the unverified claim`);
  }
});

test("inline scripts parse and responsive accessibility contracts remain present", async () => {
  const styles = `${await read("css/shared.css")}\n${await read("css/quote-form.css")}\n${await read("css/marketing.css")}`;
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(max-width: 640px\)/);

  for (const page of deployedPages) {
    const html = await read(page);
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter(match => !/\bsrc=|type="application\/ld\+json"/i.test(match[1]))
      .map(match => match[2].trim())
      .filter(Boolean);

    scripts.forEach((source, index) => {
      assert.doesNotThrow(
        () => new vm.Script(source, { filename: `${page}:inline-${index + 1}` }),
        `${page} inline script ${index + 1} must parse`
      );
    });
  }
});

test("local page assets resolve from the repository", async () => {
  for (const page of deployedPages) {
    const html = await read(page);
    const markupOnly = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
    const references = [...markupOnly.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);

    for (const reference of references) {
      if (/^(?:https?:|mailto:|tel:|data:|#|javascript:)/.test(reference)) continue;
      const cleanPath = reference.split(/[?#]/, 1)[0];
      if (!cleanPath) continue;
      assert.ok(
        existsSync(resolve(root, dirname(page), cleanPath)),
        `${page} references missing local asset ${cleanPath}`
      );
    }
  }
});

test("homepage conversion paths and coverage process remain explicit", async () => {
  const home = await read("index.html");
  const quote = await read("quote.html");

  assert.match(home, /data-track="request-coverage"/);
  assert.match(home, /data-track="hero-availability"/);
  assert.match(home, /href="tel:\+12672765287"[^>]*data-track="hero-phone"/);
  assert.match(home, /data-track="quote-form-open"/);
  assert.match(quote, /data-track="quote-form-submit"/);
  assert.match(home, /Philadelphia event security built for the room, the door, and the load-out\./);
  assert.match(home, /Proposal turnaround within 24 hours\./);
  assert.match(home, /<ol class="coverage-process-grid">/);
  assert.equal((home.match(/class="coverage-step"/g) || []).length, 4);
});
