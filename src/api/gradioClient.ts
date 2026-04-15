import { Client } from '@gradio/client';

const SPACE_ID = 'kevin-tchinda/clinical-orientation-chat';
let clientInstance: Client | null = null;

export const getClient = async (): Promise<Client> => {
  if (!clientInstance) {
    const options: any = {};
    if (import.meta.env.VITE_HF_TOKEN) {
      options.hf_token = import.meta.env.VITE_HF_TOKEN as string;
    }
    clientInstance = await Client.connect(SPACE_ID, options);
  }
  return clientInstance;
};

async function callGradio(endpoint: string, payload: any): Promise<any> {
  const client = await getClient();
  const job = client.submit(endpoint, payload);
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gradio request timed out after 45s')), 45000)
  );

  const fetchPromise = (async () => {

    // We use the manual iterator next() to have absolute control over the execution
    const iterator = (job as any)[Symbol.asyncIterator]();

    
    while (true) {
      const { value, done } = await iterator.next();
      if (done) break;
      
      const msg = value as any;
      console.log(`[Gradio] Event: ${msg.type || msg.msg}`);

      // Handle standard data messages
      if (msg.type === 'data' && msg.data) {
        return Array.isArray(msg.data) ? msg.data[0] : msg.data;
      }
      
      // Handle completion (queued or direct)
      if ((msg.type === 'complete' || msg.msg === 'process_completed') && msg.output?.data) {
        const outData = msg.output.data;
        return Array.isArray(outData) ? outData[0] : outData;
      }
    }
    throw new Error(`No data received from ${endpoint}`);
  })();

  try {
    return await Promise.race([fetchPromise, timeout]);
  } catch (err) {
    console.error(`[Gradio] error on ${endpoint}:`, err);
    throw err;
  }
}



export const sendChatMessage = async (
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<{ response: string }> => {
  return await callGradio('/chat', { messages });
};

export const generateOrientation = async (
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<any> => {
  return await callGradio('/generate-orientation', { history });
};

export const setLanguage = async (language: 'fr' | 'en'): Promise<any> => {
  return await callGradio('/set-language', { language });
};

