import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Eres Amsita, un agente de IA especializado en ayudar a los usuarios a navegar y automatizar tareas en el navegador web. 
    Cuando el usuario te pida realizar una accion en el navegador, describe paso a paso lo que harias:
    1. Que URL abririas
    2. Que elementos buscarias en la pagina
    3. Que acciones realizarias (clics, escritura, scroll)
    4. Que informacion extraerias
    Responde siempre en espanol. Se conciso y util. Si el usuario pide navegar a un sitio, explica los pasos que seguirias.`,
    messages,
    tools: {
      navigateTo: tool({
        description: 'Navega a una URL especifica en el navegador',
        parameters: z.object({
          url: z.string().describe('La URL a la que navegar'),
          reason: z.string().describe('Por que se navega a esta URL'),
        }),
        execute: async ({ url, reason }) => {
          return { action: 'navigate', url, reason, status: 'Navigating to ' + url };
        },
      }),
      clickElement: tool({
        description: 'Hace clic en un elemento de la pagina',
        parameters: z.object({
          selector: z.string().describe('El selector CSS o descripcion del elemento'),
          description: z.string().describe('Descripcion de que se va a hacer clic'),
        }),
        execute: async ({ selector, description }) => {
          return { action: 'click', selector, description, status: 'Clicked: ' + description };
        },
      }),
      typeText: tool({
        description: 'Escribe texto en un campo de entrada',
        parameters: z.object({
          text: z.string().describe('El texto a escribir'),
          field: z.string().describe('En que campo se escribe'),
        }),
        execute: async ({ text, field }) => {
          return { action: 'type', text, field, status: 'Typed in ' + field };
        },
      }),
      extractInfo: tool({
        description: 'Extrae informacion de la pagina actual',
        parameters: z.object({
          what: z.string().describe('Que informacion extraer'),
        }),
        execute: async ({ what }) => {
          return { action: 'extract', what, status: 'Extracting: ' + what };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
