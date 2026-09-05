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
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Your AI Legal Study Companion</h1>
          <p className={styles.subtitle}>
            Understand legal concepts, cases, and principles with clear,
            concise, student-friendly explanations.
          </p>
        </div>
      </header>

      <div className={styles.messages} role="log" aria-live="polite">
        <div className={styles.thread}>
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} aria-hidden />
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <div className={styles.errorInner}>{error}</div>
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
