/**
 * Per-instance state store. Replaces the former shared state array
 * array-as-map global. Keyed by the button identifier; entries are created
 * during initialization (setup_state_management) and removed on
 * cleanup/disconnect.
 *
 * The decorated config is stored per instance as the authoritative copy.
 */
import type { ATCBConfig } from '../types';

export interface ButtonInstanceState {
  config?: ATCBConfig;
  // per option: one counter per date entry, > 0 once saved/blocked (cancelled)
  optionStates: { [option: string]: number[] };
}

const instances = new Map<string, ButtonInstanceState>();
let activeId = '';

function setActiveButton(id: string): void {
  activeId = id;
}

function getActiveButton(): string {
  return activeId;
}

function createButtonInstance(id: string, config: ATCBConfig, optionStates: { [option: string]: number[] }): void {
  instances.set(id, { config, optionStates });
}

function getButtonInstance(id: string): ButtonInstanceState | undefined {
  return instances.get(id);
}

function getButtonConfig(id: string): ATCBConfig | undefined {
  return instances.get(id)?.config;
}

function getOptionStates(id: string): { [option: string]: number[] } {
  // presence is assumed by callers
  return instances.get(id)!.optionStates;
}

function deleteButtonInstance(id: string): void {
  instances.delete(id);
}

export { setActiveButton, getActiveButton, createButtonInstance, getButtonInstance, getButtonConfig, getOptionStates, deleteButtonInstance };
