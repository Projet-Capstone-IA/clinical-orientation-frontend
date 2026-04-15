import { Client } from '@gradio/client';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const client = await Client.connect('kevin-tchinda/clinical-orientation-chat', {
      hf_token: process.env.VITE_HF_TOKEN as any,
    });
    console.log('Connected to Gradio');

    const history = [
      { role: 'user', content: 'J\'ai mal à la tête et j\'ai de la fièvre.' },
      { role: 'assistant', content: 'Je suis désolé d\'apprendre cela. Depuis quand avez-vous ces symptômes ?' },
      { role: 'user', content: 'Depuis hier soir.' }
    ];

    console.log('Generating orientation...');
    const result = await client.predict('/generate-orientation', { 
      history: history 
    });

    console.log('Result Full:', JSON.stringify(result, null, 2));
    
    if (result.data && Array.isArray(result.data)) {
      console.log('Result Data[0]:', JSON.stringify(result.data[0], null, 2));
    }
  } catch (e) {
    console.error('Test failed:', e);
  }
}

test();
