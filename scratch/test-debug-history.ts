import { Client } from '@gradio/client';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const client = await Client.connect('kevin-tchinda/clinical-orientation-chat', {
      hf_token: process.env.VITE_HF_TOKEN as any,
    });

    const history = [
        { "role": "user", "content": "Bonjour" },
        { "role": "assistant", "content": "Bonjour! Comment puis-je vous aider aujourd'hui? Vous avez des symptômes spécifiques ou un souci particulier à discuter ?" },
        { "role": "user", "content": "Non, tu t'appelles vraiment Lydi ?" },
        { "role": "assistant", "content": "Oui, je suis Lydi, votre assistante médicale virtuelle. Si jamais vous avez besoin de conseils sur une préoccupation de santé, n'hésitez pas à me contacter !" },
        { "role": "user", "content": "C'est d'accord.." },
        { "role": "assistant", "content": "Super ! N'oubliez pas que j'ai là pour répondre à toutes vos questions liées à la santé quand vous le souhaitez. Prenez soin de vous !" },
        { "role": "user", "content": "J'ai un peu mal au ventre depuis quelques jours." },
        { "role": "assistant", "content": "Je suis désolé d'entendre cela. Pour mieux comprendre votre situation :\n\n- Quelle est l'intensité de votre douleur (faible, modérée, sévère) ?\n- Avez-vous remarqué quelque chose qui aggrave ou atténue cette sensation ? Par exemple, certains aliments, stress ou activités physiques ?\n- Y a-t-il d'autres symptômes associés comme nausées, diarrhée, vomissements ou perte d'appétit ?\n- La durée exacte et si elle varie tout au long de la journée.\n\nCes informations peuvent m'aider à orienter les meilleurs conseils suivants. Cependant, il est important de consulter un professionnel de santé pour obtenir un diagnostic approprié et traitement adapté.\n" },
        { "role": "user", "content": "Je ne sais pas, aussi, j'ai des brûlures d'estomac et un reflux gastrique." },
        { "role": "assistant", "content": "Merci pour ces détails supplémentaires :\n\n- Les fréquences des épisodes de brûlure d'estomac et de reflux gastrique sont elles régulières ou irrégulières ?\n- Le repas précédant ces symptômes inclut-il souvent des aliments épicés, gras ou acidifiants connus pour déclencher ce type de problème ?\n- Utilisez-vous actuellement quoi que ce soit pour soulager ces symptômes, par exemple antiacides ou autres médicaments sans ordonnance ?\n\nBien que ces informations puissent suggérer certaines causes possibles telles que l'indigestion ou le syndrome du reflux gastro-œsophagien (SRGO), seul un médecin peut établir un diagnostic définitif. Il serait judicieux de consulter un prestataire de soins de santé afin de recevoir des conseils personnalisés et potentiellement passer des examens complémentaires nécessaires.\n\n" },
        { "role": "user", "content": "Non, je n'ai pas eu d'aliments épicés. Mais j'ai bu du coca en journée. Ce que je prends habituellement c'est gaviscon." },
        { "role": "assistant", "content": "Comprenant maintenant que vous utilisez Gaviscon et que vous avez ingéré du coca colonne, voici quelques points importants :\n\n- Certains boissons gazeuses, y compris celles contenant du phosphate tricalcique (comme dans beaucoup de sodas light incluant la Coca Cola), peuvent provoquer un réflexe vasovagal entraînant une augmentation temporaire de la production de salive et parfois même contribuer aux troubles digestifs.\n- Bien que Gaviscon fonctionne généralement bien pour neutraliser l’acide gastrique et fournir un tampon protecteur contre la peau sensible autour de l'œsophage, son efficacité face à toute cause externe doit être considérée avec prudence.\n\nVoici mes recommandations :\n\n- Essayez de limiter la consommation de boissons gazeuses pendant plusieurs heures avant de savoir comment affectera leur présence chez vous.\n- Gardez un registre de tous les aliments et substances pouvant influencer vos symptômes pour identifier plus clairement les facteurs déclenchants.\n- Continuez à prendre Gaviscon selon les indications posées par un professionnel de santé ; cependant, étant donné que vos symptômes persistent, il convient de consulter rapidement un spécialiste de la santé pour explorer davantage possible causalité sous-jacente.\n\nUn suivi médical sera essentiel pour éviter les complications et adapter correctement votre plan thérapeutique.\n\n\n" },
        { "role": "user", "content": "Très bien, Je te remercie." },
        { "role": "assistant", "content": "De rien ! Je suis content d'avoir pu offrir des suggestions pertinentes. Rappelez-vous, prioriser une consultation médicale reste crucial pour aborder adéquatement vos symptômes persistants. Si vous avez d'autres questions ou besoin d'une assistance ultérieure, n'hésitez pas à demander. Prends soin de toi !\n" }
    ];

    console.log('Generating orientation with problematic history...');
    const job = client.submit('/generate-orientation', { history });
    
    for await (const message of job) {
      if (message.type === 'data') {
        console.log('Data received:', JSON.stringify(message.data, null, 2));
      }
    }
  } catch (e) {
    console.error('Test failed:', e);
  }
}

test();
