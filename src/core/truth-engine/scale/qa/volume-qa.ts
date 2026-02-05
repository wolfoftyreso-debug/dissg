/**
 * VOLUME QA
 * 
 * Automatisk kvalitetskontroll på massproducerade noder.
 * Fail ⇒ noden existerar inte.
 */

import type { GeneratedPacket } from '../factory/packet-factory';

/**
 * QA CHECK RESULT
 */
export interface QACheckResult {
  check_type: string;
  passed: boolean;
  details: string;
}

/**
 * PACKET QA RESULT
 */
export interface PacketQAResult {
  packet_id: string;
  passed: boolean;
  checks: QACheckResult[];
}

/**
 * VOLUME QA ENGINE
 */
export class VolumeQA {
  /**
   * Run QA on a single packet
   */
  runPacketQA(packet: GeneratedPacket): PacketQAResult {
    const checks: QACheckResult[] = [];

    // Check 1: Has valid packet_id
    checks.push({
      check_type: 'has_id',
      passed: !!packet.packet_id,
      details: packet.packet_id ? 'Valid ID' : 'Missing ID',
    });

    // Check 2: Has text
    checks.push({
      check_type: 'has_text',
      passed: !!packet.text,
      details: packet.text ? 'Has text' : 'Missing text',
    });

    // Check 3: Has measures
    checks.push({
      check_type: 'has_measures',
      passed: packet.measures_bound.length > 0,
      details: `${packet.measures_bound.length} measures`,
    });

    // Check 4: Valid status
    checks.push({
      check_type: 'valid_status',
      passed: packet.validation_status === 'valid',
      details: `Status: ${packet.validation_status}`,
    });

    return {
      packet_id: packet.packet_id,
      passed: checks.every(c => c.passed),
      checks,
    };
  }

  /**
   * Run QA on batch
   */
  runBatchQA(packets: GeneratedPacket[]): {
    total: number;
    passed: number;
    failed: number;
    results: PacketQAResult[];
  } {
    const results = packets.map(p => this.runPacketQA(p));
    return {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      results,
    };
  }

  /**
   * Filter valid packets
   */
  filterValid(packets: GeneratedPacket[]): GeneratedPacket[] {
    return packets.filter(p => this.runPacketQA(p).passed);
  }
}

/**
 * Run QA on production batch
 */
export function runProductionQA(packets: GeneratedPacket[]): {
  valid: GeneratedPacket[];
  rejected: GeneratedPacket[];
} {
  const qa = new VolumeQA();
  const results = qa.runBatchQA(packets);

  const valid: GeneratedPacket[] = [];
  const rejected: GeneratedPacket[] = [];

  for (let i = 0; i < packets.length; i++) {
    if (results.results[i].passed) {
      valid.push(packets[i]);
    } else {
      rejected.push(packets[i]);
    }
  }

  return { valid, rejected };
}
