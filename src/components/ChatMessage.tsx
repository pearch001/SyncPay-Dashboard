import { useState, useEffect } from 'react';
import { Sparkles, User, Clock, Check, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import ChartRenderer from './ChartRenderer';
import { formatRelativeTime, formatFullTimestamp } from '../utils/timeUtils';
import type { MessageStatus } from '../store/chatStore';
import type { ChartData } from '../types';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  status?: MessageStatus;
  metadata?: {
    charts?: ChartData[];
  };
}

// Chart skeleton loading component
const ChartSkeleton = () => (
  <div className="animate-pulse bg-gray-50 rounded-xl border border-gray-100 p-4 mt-4">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-center gap-2 p-4">
      {[40, 65, 45, 80, 55, 70, 50, 75].map((height, i) => (
        <div
          key={i}
          className="w-8 bg-gray-200 rounded-t animate-pulse"
          style={{ 
            height: `${height}%`,
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
    </div>
  </div>
);

// Parse chart data from content
const parseChartsFromContent = (content: string): { textContent: string; charts: ChartData[] } => {
  const charts: ChartData[] = [];
  
  // Regex to match ```chart ... ``` blocks
  const chartBlockRegex = /```chart\s*([\s\S]*?)```/g;
  
  let textContent = content;
  let match;
  
  while ((match = chartBlockRegex.exec(content)) !== null) {
    try {
      const chartJson = match[1].trim();
      const chartData = JSON.parse(chartJson) as ChartData;
      
      // Validate chart data structure
      if (chartData.type && chartData.title && chartData.data) {
        charts.push(chartData);
      }
    } catch (e) {
      // Invalid JSON, skip this block
      console.warn('Failed to parse chart data:', e);
    }
  }
  
  // Remove chart blocks from text content
  textContent = content.replace(chartBlockRegex, '').trim();
  
  // Also check for JSON blocks that might contain chart data
  const jsonBlockRegex = /```json\s*([\s\S]*?)```/g;
  
  while ((match = jsonBlockRegex.exec(content)) !== null) {
    try {
      const jsonData = JSON.parse(match[1].trim());
      
      // Check if this JSON is chart data
      if (jsonData.type && jsonData.title && jsonData.data && 
          ['line', 'bar', 'pie', 'donut', 'area'].includes(jsonData.type)) {
        charts.push(jsonData as ChartData);
        textContent = textContent.replace(match[0], '').trim();
      }
    } catch (e) {
      // Not valid JSON or not chart data, keep as is
    }
  }
  
  return { textContent, charts };
};

export default function ChatMessage({ 
  role, 
  content, 
  timestamp, 
  isLoading, 
  status,
  metadata 
}: ChatMessageProps) {
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [parsedContent, setParsedContent] = useState<{ textContent: string; charts: ChartData[] }>({
    textContent: content,
    charts: []
  });

  // Parse content and combine with metadata charts
  useEffect(() => {
    if (role === 'assistant' && !isLoading) {
      const { textContent, charts: parsedCharts } = parseChartsFromContent(content);
      
      // Combine parsed charts with metadata charts
      const allCharts = [
        ...parsedCharts,
        ...(metadata?.charts || [])
      ];
      
      setParsedContent({ textContent, charts: allCharts });
      
      // Simulate chart loading with smooth transition
      if (allCharts.length > 0) {
        const timer = setTimeout(() => setChartsLoaded(true), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [content, metadata, role, isLoading]);

  const getStatusLabel = () => {
    if (role !== 'user' || !status) return '';
    switch (status) {
      case 'sending':
        return 'Sending';
      case 'sent':
        return 'Sent';
      case 'error':
        return 'Failed to send';
      default:
        return '';
    }
  };

  const renderStatusIcon = () => {
    if (role !== 'user' || !status) return null;

    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-white/70" aria-hidden="true" />;
      case 'sent':
        return <Check className="h-3 w-3 text-white/70" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-300" aria-hidden="true" />;
      default:
        return null;
    }
  };

  if (role === 'user') {
    return (
      <article
        className="flex items-start justify-end gap-2 sm:gap-3 animate-fade-in"
        role="article"
        aria-label={`Your message from ${formatRelativeTime(timestamp)}`}
      >
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[70%]">
          <div className="bg-primary-500 text-white rounded-2xl rounded-tr-md px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
          <div
            className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-1 px-1"
            title={formatFullTimestamp(timestamp)}
            role="status"
            aria-label={`Message ${getStatusLabel()}. ${formatFullTimestamp(timestamp)}`}
          >
            {renderStatusIcon()}
            <span aria-hidden="true">{formatRelativeTime(timestamp)}</span>
          </div>
        </div>
        <div className="flex-shrink-0" aria-hidden="true">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="flex items-start gap-2 sm:gap-3 animate-fade-in"
      role="article"
      aria-label={`AI Assistant message from ${formatRelativeTime(timestamp)}`}
    >
      <div className="flex-shrink-0" aria-hidden="true">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
        </div>
      </div>
      <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%] lg:max-w-[85%]">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
          {isLoading ? (
            <div className="flex items-center space-x-1 py-1" role="status" aria-label="AI is typing">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <>
              {/* Text content */}
              {parsedContent.textContent && (
                <div className="text-xs sm:text-sm leading-relaxed text-gray-800 prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Code blocks
                      code: ({ node, inline, className, children, ...props }: any) => {
                        if (inline) {
                          return (
                            <code className="bg-gray-100 text-primary-700 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return <CodeBlock className={className}>{children}</CodeBlock>;
                      },
                      // Links - open in new tab, styled with primary color
                      a: ({ node, children, href, ...props }: any) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                          aria-label={`Link to ${href} (opens in new tab)`}
                          {...props}
                        >
                          {children}
                        </a>
                      ),
                      // Bold text
                      strong: ({ node, children, ...props }: any) => (
                        <strong className="font-semibold text-gray-900" {...props}>
                          {children}
                        </strong>
                      ),
                      // Italic text
                      em: ({ node, children, ...props }: any) => (
                        <em className="italic text-gray-700" {...props}>
                          {children}
                        </em>
                      ),
                      // Lists
                      ul: ({ node, children, ...props }: any) => (
                        <ul className="list-disc list-inside space-y-1 my-2" {...props}>
                          {children}
                        </ul>
                      ),
                      ol: ({ node, children, ...props }: any) => (
                        <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
                          {children}
                        </ol>
                      ),
                      // Paragraphs
                      p: ({ node, children, ...props }: any) => (
                        <p className="my-2 first:mt-0 last:mb-0" {...props}>
                          {children}
                        </p>
                      ),
                      // Headings
                      h1: ({ node, children, ...props }: any) => (
                        <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0" {...props}>
                          {children}
                        </h1>
                      ),
                      h2: ({ node, children, ...props }: any) => (
                        <h2 className="text-base font-bold mt-3 mb-2 first:mt-0" {...props}>
                          {children}
                        </h2>
                      ),
                      h3: ({ node, children, ...props }: any) => (
                        <h3 className="text-sm font-bold mt-2 mb-1 first:mt-0" {...props}>
                          {children}
                        </h3>
                      ),
                    }}
                  >
                    {parsedContent.textContent}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Charts section */}
              {parsedContent.charts.length > 0 && (
                <div className={`mt-4 space-y-4 ${parsedContent.textContent ? 'pt-4 border-t border-gray-100' : ''}`}>
                  {parsedContent.charts.map((chart, index) => (
                    <div 
                      key={`${chart.title}-${index}`}
                      className={`transition-all duration-500 ${
                        chartsLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      {chartsLoaded ? (
                        <ChartRenderer chartData={chart} />
                      ) : (
                        <ChartSkeleton />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <time
          className="text-[10px] sm:text-xs text-gray-400 mt-1 px-1"
          dateTime={timestamp.toISOString()}
          title={formatFullTimestamp(timestamp)}
        >
          {formatRelativeTime(timestamp)}
        </time>
      </div>
    </article>
  );
}
