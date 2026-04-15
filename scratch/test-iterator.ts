import { Client } from '@gradio/client';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const client = await Client.connect('kevin-tchinda/clinical-orientation-chat', {
      hf_token: process.env.VITE_HF_TOKEN as any,
    });

    const messages = [{ role: 'user', content: 'Hello' }];
    const job = client.submit('/chat', { messages });
    
    console.log('Iterating over job...');
    for await (const message of job) {
      console.log('Message type:', message.type);
      if (message.type === 'data') {
        console.log('Data received:', JSON.stringify(message.data, null, 2));
      }
    }
    console.log('Job finished');
  } catch (e) {
    console.error('Test failed:', e);
  }
}

test();
