import type { State } from '$lib/types';
import { defaultState, updateCodeStore } from '$lib/util/state';

export const loadDataFromUrl = async (): Promise<void> => {
  const state: Partial<State> = defaultState;

  const url = 'http://localhost:3001/api/diagram';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Diagramm konnte nicht geladen werden (Status: ${response.status})`);
    }

    const diagram = await response.text();
    state.code = diagram;

    updateCodeStore({
      ...state,
      updateDiagram: true
    });
    console.info('[Mermaid] Diagramm erfolgreich geladen');
  } catch (error) {
    console.error('[Mermaid] Fehler beim Laden des Diagramms:', error);
  }
};

/*
export const loadDataFromUrl = async (): Promise<void> => {
  const searchParams = new URLSearchParams(window.location.search);
  let state: Partial<State> = defaultState;
  let loaded = false;
  const codeURL: string | undefined = searchParams.get('code') ?? undefined;
  const configURL: string | undefined = searchParams.get('config') ?? undefined;

  let code: string | undefined;
  const config = configURL ? await fetchText(configURL) : defaultState.mermaid;

  if (codeURL) {
    code = await fetchText(codeURL);
    loaded = true;
  }
  if (code) {
    if (!codeURL) {
      throw new Error('Code URL is not defined');
    }
    state = {
      code,
      loader: {
        config: {
          codeURL,
          configURL
        },
        type: 'files'
      },
      mermaid: config
    };
  } else {
    for (const [key, value] of searchParams.entries()) {
      if (key in loaders) {
        try {
          state = await loaders[key](value);
          loaded = true;
          break;
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  loaded &&
    updateCodeStore({
      ...state,
      updateDiagram: true
    });
};
*/
