// 議員データの文字列フィールドには「URL＋補足コメント」が混在している場合があるため、
// 表示用にURL部分だけを抜き出すためのヘルパー。
const URL_PATTERN = /https?:\/\/[^\s（）()]+/;

export function extractUrl(value: string): string | null {
  const match = value.match(URL_PATTERN);
  return match ? match[0] : null;
}

export function hasValue(value: string | undefined): value is string {
  return !!value && value.trim() !== '';
}
