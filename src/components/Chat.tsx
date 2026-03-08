import { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import styles from './Chat.module.css';

export function Chat() {
  const { messages, loading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>💻 Coding assistant</h1>
        <p>Ask coding questions only. Answers are to the point, first principles.</p>
      </header>

      <div className={styles.messages} role="log" aria-live="polite">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} aria-hidden />
      </div>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
