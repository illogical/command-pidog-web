export const SILENCE_THRESHOLD = 0.02
export const SILENCE_DURATION_MS = 2000
export const MAX_RECORDING_MS = 12000

export function flattenArray(channelBuffers: Float32Array[]): Float32Array {
  const totalLength = channelBuffers.reduce((acc, b) => acc + b.length, 0)
  const result = new Float32Array(totalLength)
  let offset = 0
  for (const b of channelBuffers) {
    result.set(b, offset)
    offset += b.length
  }
  return result
}

export function toWavBlob(buffers: Float32Array[], sampleRate: number): Blob {
  const samples = flattenArray(buffers)
  const numChannels = 1
  const bitsPerSample = 16
  const bytesPerSample = bitsPerSample / 8
  const dataLength = samples.length * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataLength)
  const view = new DataView(buffer)

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true)
  view.setUint16(32, numChannels * bytesPerSample, true)
  view.setUint16(34, bitsPerSample, true)
  writeString(36, 'data')
  view.setUint32(40, dataLength, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    offset += 2
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

export function computeRMS(analyser: AnalyserNode, dataArray: Uint8Array<ArrayBuffer>): number {
  analyser.getByteTimeDomainData(dataArray)
  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128 - 1
    sum += v * v
  }
  return Math.sqrt(sum / dataArray.length)
}

export function getSupportedMimeType(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t
  }
  return ''
}
