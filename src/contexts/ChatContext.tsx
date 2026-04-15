import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { sendChatMessage, generateOrientation } from '../api/gradioClient';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isWaiting: boolean;
  orientationData: any | null;
  error: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'EDIT_MESSAGE'; payload: { id: string; newContent: string } }
  | { type: 'TRUNCATE_AFTER'; payload: { messageId: string } }
  | { type: 'SET_WAITING'; payload: boolean }
  | { type: 'SET_ORIENTATION'; payload: any }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_HISTORY' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload], error: null };
    case 'EDIT_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? { ...msg, content: action.payload.newContent } : msg
        ),
      };
    case 'TRUNCATE_AFTER': {
      const index = state.messages.findIndex((m) => m.id === action.payload.messageId);
      return { ...state, messages: state.messages.slice(0, index + 1) };
    }
    case 'SET_WAITING':
      return { ...state, isWaiting: action.payload };
    case 'SET_ORIENTATION':
      return { ...state, orientationData: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_HISTORY':
      return { ...state, messages: [], orientationData: null, error: null };
    default:
      return state;
  }
};

interface ChatContextValue extends ChatState {
  sendUserMessage: (content: string) => Promise<void>;
  editUserMessage: (messageId: string, newContent: string) => Promise<void>;
  clearHistory: () => void;
  fetchOrientation: () => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Fonction de nettoyage : élimine les messages assistant sans contenu valide
const cleanHistory = (messages: Message[]): { role: 'user' | 'assistant'; content: string }[] => {
  const cleaned: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const msg of messages) {
    if (msg.role === 'user') {
      cleaned.push({ role: 'user', content: msg.content });
    } else if (msg.role === 'assistant' && msg.content && msg.content.trim() !== '') {
      cleaned.push({ role: 'assistant', content: msg.content });
    }
    // Les messages assistant vides sont ignorés
  }
  return cleaned;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedMessages, setStoredMessages] = useLocalStorage<Message[]>('lydi-chat', []);
  const [state, dispatch] = useReducer(chatReducer, {
    messages: storedMessages,
    isWaiting: false,
    orientationData: null,
    error: null,
  });

  // Sync to localStorage
  React.useEffect(() => {
    setStoredMessages(state.messages);
  }, [state.messages, setStoredMessages]);

  const sendUserMessage = useCallback(
    async (content: string) => {
      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
      dispatch({ type: 'SET_WAITING', payload: true });

      try {
        // Utilisation de cleanHistory pour garantir un historique valide
        const history = cleanHistory([...state.messages, userMsg]);
        const result = await sendChatMessage(history);
        const assistantMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: result.response,
          timestamp: Date.now(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg });
      } catch (error: any) {
        console.error('Chat error:', error);
        dispatch({ type: 'SET_ERROR', payload: error?.message || 'Erreur de connexion' });
      } finally {
        dispatch({ type: 'SET_WAITING', payload: false });
      }
    },
    [state.messages]
  );

  const editUserMessage = useCallback(
    async (messageId: string, newContent: string) => {
      dispatch({ type: 'EDIT_MESSAGE', payload: { id: messageId, newContent } });
      dispatch({ type: 'TRUNCATE_AFTER', payload: { messageId } });

      const updatedMessages = state.messages
        .map((m) => (m.id === messageId ? { ...m, content: newContent } : m))
        .filter((_, idx, arr) => {
          const foundIdx = arr.findIndex((m) => m.id === messageId);
          return idx <= foundIdx;
        });

      dispatch({ type: 'SET_WAITING', payload: true });
      try {
        // Nettoyage ici aussi
        const history = cleanHistory(updatedMessages);
        const result = await sendChatMessage(history);
        const assistantMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: result.response,
          timestamp: Date.now(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg });
      } catch (error: any) {
        console.error(error);
        dispatch({ type: 'SET_ERROR', payload: error?.message || 'Erreur de connexion' });
      } finally {
        dispatch({ type: 'SET_WAITING', payload: false });
      }
    },
    [state.messages]
  );

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const fetchOrientation = useCallback(async () => {
    try {
      console.log('[Lydi] Starting orientation fetch...');
      dispatch({ type: 'SET_ORIENTATION', payload: null });
      const fullHistory = cleanHistory(state.messages);

      // Clinical Focus: Strip trailing polite closing remarks that might stop the AI from generating orientations
      const CLOSING_KEYWORDS = [
        'merci', 'thank', 'remercie', 'au revoir', 'goodbye', 'bye',
        'bonne journée', 'bonsoir', 'c\'est tout', 'that\'s all',
        'de rien', 'prends soin de toi', 'prenez soin de vous', 'n\'hésitez pas', 
        'pas d\'assistance', 'assistance ultérieure', 'pour aborder'
      ];

      let clinicalHistory = [...fullHistory];
      while (clinicalHistory.length > 0) {
        const lastMsg = clinicalHistory[clinicalHistory.length - 1];
        const content = lastMsg.content.toLowerCase().trim();

        // Detect closing: 
        // - For users: must be short AND contain keywords
        // - For assistants: just contain keywords (they are often very talkative in their sign-offs)
        const hasKeyword = CLOSING_KEYWORDS.some(kw => content.includes(kw));
        const isClosing = lastMsg.role === 'user' 
          ? (hasKeyword && content.length < 100)
          : hasKeyword;

        if (isClosing) {
          clinicalHistory.pop();
        } else {
          break;
        }
      }


      // Ensure we don't send an empty history if everything was filtered out
      const finalHistory = clinicalHistory.length > 0 ? clinicalHistory : fullHistory;
      console.log('[Lydi] Pre-filtered history length:', fullHistory.length);
      console.log('[Lydi] Clinically focused history length:', finalHistory.length);
      
      const data = await generateOrientation(finalHistory);
      console.log('[Lydi] Raw Orientation Data:', JSON.stringify(data, null, 2));
      console.log('[Lydi] Orientation data received:', !!data);
      dispatch({ type: 'SET_ORIENTATION', payload: data });
    } catch (error: any) {
      console.error('[Lydi] Orientation generation failed:', error);
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Erreur de génération' });
    }
  }, [state.messages]);




  return (
    <ChatContext.Provider
      value={{
        ...state,
        sendUserMessage,
        editUserMessage,
        clearHistory,
        fetchOrientation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};