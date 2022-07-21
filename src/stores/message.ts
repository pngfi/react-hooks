import create from 'zustand';
import { IMessage } from '../types/common';

type MessageStore = {
  messages: Record<string, IMessage>;
  pushMessage: (message: IMessage) => number;
  removeMessage: (id: number) => void;
  clearMessages: () => void;
};

export const useMessageStore = create(
  (set: any, get: any): MessageStore => ({
    messages: {},
    pushMessage: (message: IMessage): number => {
      const { messages } = get();
      const id = Object.keys(messages).length;
      set((state: any) => ({
        messages: { ...state.messages, [id]: { ...message, id } },
      }));
      return id;
    },
    removeMessage: (id: number) => {
      set((state: any) => ({ messages: { ...state.messages, [id]: null } }));
    },
    clearMessages: () => set({ messages: {} }),
  }),
);
