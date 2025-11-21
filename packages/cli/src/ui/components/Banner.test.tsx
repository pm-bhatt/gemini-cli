/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { render } from '../../test-utils/render.js';
import { Banner } from './Banner.js';
import { describe, it, expect } from 'vitest';

describe('Banner', () => {
  it.each([
    ['warning mode', true, 'Warning Message'],
    ['info mode', false, 'Info Message'],
  ])('renders in %s', (_, isWarning, text) => {
    const { lastFrame } = render(
      <Banner bannerText={text} isWarning={isWarning} width={80} />,
    );
    const output = lastFrame();
    expect(output).toContain(text);
  });

  it('handles newlines in text', () => {
    const text = 'Line 1\\nLine 2';
    const { lastFrame } = render(
      <Banner bannerText={text} isWarning={false} width={80} />,
    );
    const output = lastFrame();
    expect(output).toContain('Line 1');
    expect(output).toContain('Line 2');
  });
});
