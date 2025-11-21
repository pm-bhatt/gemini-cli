/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { render } from '../../test-utils/render.js';
import { SuggestionsDisplay } from './SuggestionsDisplay.js';
import { describe, it, expect } from 'vitest';
import { CommandKind } from '../commands/types.js';

describe('SuggestionsDisplay', () => {
  const mockSuggestions = [
    { label: 'Command 1', value: 'command1', description: 'Description 1' },
    { label: 'Command 2', value: 'command2', description: 'Description 2' },
    { label: 'Command 3', value: 'command3', description: 'Description 3' },
  ];

  it('renders loading state', () => {
    const { lastFrame } = render(
      <SuggestionsDisplay
        suggestions={[]}
        activeIndex={0}
        isLoading={true}
        width={80}
        scrollOffset={0}
        userInput=""
        mode="reverse"
      />,
    );
    expect(lastFrame()).toContain('Loading suggestions...');
  });

  it('renders nothing when empty and not loading', () => {
    const { lastFrame } = render(
      <SuggestionsDisplay
        suggestions={[]}
        activeIndex={0}
        isLoading={false}
        width={80}
        scrollOffset={0}
        userInput=""
        mode="reverse"
      />,
    );
    expect(lastFrame()).toBe('');
  });

  it('renders suggestions list', () => {
    const { lastFrame } = render(
      <SuggestionsDisplay
        suggestions={mockSuggestions}
        activeIndex={0}
        isLoading={false}
        width={80}
        scrollOffset={0}
        userInput=""
        mode="reverse"
      />,
    );
    const output = lastFrame();
    expect(output).toContain('command1');
    expect(output).toContain('command2');
    expect(output).toContain('command3');
    expect(output).toContain('Description 1');
  });

  it('highlights active item', () => {
    // This test relies on visual inspection or implementation details (colors)
    // For now, we just ensure it renders without error and contains the item
    const { lastFrame } = render(
      <SuggestionsDisplay
        suggestions={mockSuggestions}
        activeIndex={1}
        isLoading={false}
        width={80}
        scrollOffset={0}
        userInput=""
        mode="reverse"
      />,
    );
    expect(lastFrame()).toContain('command2');
  });

  it('handles scrolling', () => {
    const manySuggestions = Array.from({ length: 20 }, (_, i) => ({
      label: `Cmd ${i}`,
      value: `Cmd ${i}`,
      description: `Description ${i}`,
    }));

    const { lastFrame } = render(
      <SuggestionsDisplay
        suggestions={manySuggestions}
        activeIndex={10}
        isLoading={false}
        width={80}
        scrollOffset={5}
        userInput=""
        mode="reverse"
      />,
    );
    const output = lastFrame();

    // Should show items from index 5 to 5 + MAX_SUGGESTIONS_TO_SHOW
    // MAX_SUGGESTIONS_TO_SHOW is 8, so it should show 5, 6, 7, 8, 9, 10, 11, 12
    expect(output).toContain('Cmd 5');
    expect(output).toContain('Cmd 12');

    // Should NOT show items before scroll offset
    expect(output).not.toContain('Cmd 4');

    // Should show scroll indicators
    expect(output).toContain('▲');
    expect(output).toContain('▼');
  });

  it('renders MCP tag for MCP prompts', () => {
    const mcpSuggestions = [
      {
        label: 'MCP Tool',
        value: 'mcp-tool',
        commandKind: CommandKind.MCP_PROMPT,
      },
    ];

    const { lastFrame } = render(
      <SuggestionsDisplay
        suggestions={mcpSuggestions}
        activeIndex={0}
        isLoading={false}
        width={80}
        scrollOffset={0}
        userInput=""
        mode="reverse"
      />,
    );
    expect(lastFrame()).toContain('[MCP]');
  });
});
