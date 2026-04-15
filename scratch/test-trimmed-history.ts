import { Client } from '@gradio/client';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const client = await Client.connect('kevin-tchinda/clinical-orientation-chat', {
      hf_token: process.env.VITE_HF_TOKEN as any,
    });

    const fullHistory = [
        { "role": "user", "content": "Bonjour" },
        { "role": "assistant", "content": "..." },
        { "role": "user", "content": "Non, tu t'appelles vraiment Lydi ?" },
        { "role": "assistant", "content": "..." },
        { "role": "user", "content": "C'est d'accord.." },
        { "role": "assistant", "content": "..." },
        { "role": "user", "content": "J'ai un peu mal au ventre depuis quelques jours." },
        { "role": "assistant", "content": "..." },
        { "role": "user", "content": "Je ne sais pas, aussi, j'ai des brûlures d'estomac et un reflux gastrique." },
        { "role": "assistant", "content": "..." },
        { "role": "user", "content": "Non, je n'ai pas eu d'aliments épicés. Mais j'ai bu du coca en journée. Ce que je prends habituellement c'est gaviscon." },
        { "role": "assistant", "content": "..." },
        { "role": "user", "content": "Très bien, Je te remercie." },
        { "role": "assistant", "content": "..." }
    ];

    // Trim the last 2 messages (the polite sign-off)
    const trimmedHistory = fullHistory.slice(0, -2);

    console.log('Generating orientation with TRIMMED history...');
    const job = client.submit('/generate-orientation', { history: trimmedHistory });
    
    for await (const message of job) {
      if (message.type === 'data') {
        console.log('Data received (Trimmed):', JSON.stringify(message.data, null, 2));
      }
    }
  } catch (e) {
    console.error('Test failed:', e);
  }
}

test();
